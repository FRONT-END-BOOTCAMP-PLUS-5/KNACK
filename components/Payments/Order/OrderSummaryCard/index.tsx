'use client'

import React, { useMemo, useState } from 'react'
import styles from './orderSummaryCard.module.scss'
import Image from 'next/image'
import { STORAGE_PATHS } from '@/constraint/auth'
import FastDeliveryModal from '@/components/payments/Modals/FastDeliveryModal'
import WarehouseStorageModal from '@/components/payments/Modals/WareHouseStorageModal'
import { Props, PropsWithCoupon } from '@/types/order'

export default function OrderSummaryCard({
    orderItems,
    deliveryType,
    onChangeDelivery,
    totalPrice,
    coupons = [],
    selectedCouponId = null,
    onSelectCoupon,
    couponAmount,
}: PropsWithCoupon) {
    const [openTotal, setOpenTotal] = useState(true)
    const [openFastModal, setOpenFastModal] = useState(false)
    const [openWarehouseModal, setOpenWarehouseModal] = useState(false)

    // 금액 계산 - Hooks must be called before any early returns
    const productTotal = useMemo(
        () => orderItems?.reduce((sum, it) => sum + it.price * it.quantity, 0) || 0,
        [orderItems]
    )
    const shippingFee = useMemo(() => (deliveryType === 'FAST' ? 5000 : 0), [deliveryType])

    // 쿠폰 적용 가능한지 판단 (장바구니에 해당 productId 포함)
    const applicableCoupons = useMemo(() => {
        const pset = new Set(orderItems.map(i => i.productId))
        return (coupons ?? []).filter(c => pset.has(c.productId))
    }, [coupons, orderItems])

    // 선택된 쿠폰의 할인액 프리뷰 (부모가 내려주면 그 값을 우선)
    const previewCouponAmount = useMemo(() => {
        if (typeof couponAmount === 'number') return couponAmount
        if (!selectedCouponId) return 0
        const c = applicableCoupons.find(x => x.couponId === selectedCouponId)
        if (!c) return 0
        const targetSum = orderItems
            .filter(it => it.productId === c.productId)
            .reduce((s, it) => s + it.price * it.quantity, 0)
        return Math.max(0, Math.floor(targetSum * (c.salePercent / 100)))
    }, [couponAmount, selectedCouponId, applicableCoupons, orderItems])

    if (!orderItems?.length) return <div>주문 상품이 없습니다.</div>

    return (
        <>
            <section className={styles.sectionWrap}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <p>주문 상품 및 쿠폰</p>
                        <p className={styles.item_count}>총 {orderItems.length}건</p>
                    </div>

                    <div className={styles.hr} />

                    <div className={styles.coupon_toggle}>
                        <span>적용할 쿠폰이 없습니다</span>
                        <label className={styles.switch}>
                            <input type="checkbox" disabled />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.hr} />

                    <div className={styles.product_list}>
                        {orderItems.map((item, idx) => (
                            <div className={styles.product_box} key={`${item.productId}-${idx}`}>
                                <Image
                                    src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item.thumbnail_image}`}
                                    alt={item.kor_name ?? item.eng_name ?? `product-${item.productId}`}
                                    className={styles.image}
                                    width={80}
                                    height={80}
                                />
                                <div className={styles.details}>
                                    <div className={styles.name}>{item.eng_name ?? ''}</div>
                                    <div className={styles.subtitle}>{item.kor_name ?? ''}</div>
                                    <div className={styles.model}>#{item.productId}</div>
                                    <div className={styles.meta}>
                                        <span className={styles.size}>240(US 5)</span>
                                        <span className={styles.meta_sep}>/</span>
                                        <span className={styles.inline_icon}><Image src="/icons/lightning.png" alt="체크" width={12} height={12} />빠른배송</span>
                                    </div>
                                </div>
                                <div className={styles.price_wrap}>
                                    <div className={styles.price}>
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </div>
                                    <button className={styles.kebab} aria-label="메뉴" type="button">⋮</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.section_title}>배송방법</div>
                    <div className={styles.delivery}>
                        <label className={styles.radio_option}>
                            <input
                                type="radio"
                                name="delivery"
                                value="FAST"
                                checked={deliveryType === 'FAST'}
                                onChange={() => onChangeDelivery('FAST')}
                            />
                            <span className={styles.custom_radio}></span>
                            <div className={styles.radio_text}>
                                <div className={styles.main}>빠른배송</div>
                                <div className={styles.sub}>검수 완료 · 내일 8/11(월) 도착 예정 <Image src="/icons/question_circle.png" alt="체크" width={17} height={17} onClick={() => setOpenFastModal(true)} /></div>
                            </div>
                        </label>

                        <label className={styles.radio_option}>
                            <input
                                type="radio"
                                name="delivery"
                                value="STOCK"
                                checked={deliveryType === 'STOCK'}
                                onChange={() => onChangeDelivery('STOCK')}
                            />
                            <span className={styles.custom_radio}></span>
                            <div className={styles.radio_text}>
                                <div className={styles.main}>창고보관</div>
                                <div className={styles.sub}>배송 없이 빠른 판매 <Image src="/icons/question_circle.png" alt="체크" width={17} height={17} onClick={() => setOpenWarehouseModal(true)} /></div>
                            </div>
                        </label>
                    </div>

                    <div className={styles.section_title}>할인쿠폰</div>
                    {applicableCoupons.length > 0 ? (
                        <div className={styles.coupon_row}>
                            <select
                                className={styles.coupon_select}
                                value={selectedCouponId ?? ''}
                                onChange={(e) => onSelectCoupon?.(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">쿠폰 선택 안 함</option>
                                {applicableCoupons.map(c => (
                                    <option key={c.couponId} value={c.couponId}>
                                        {c.name} · {c.salePercent}% ({c.productId})
                                    </option>
                                ))}
                            </select>

                            {selectedCouponId ? (
                                <button
                                    type="button"
                                    className={styles.coupon_clear}
                                    onClick={() => onSelectCoupon?.(null)}
                                >
                                    해제
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className={styles.coupon}>
                            <input type="text" disabled value="사용 가능한 쿠폰이 없습니다." />
                            <button disabled>쿠폰 선택</button>
                        </div>
                    )}

                    {/* 결제금액 (토글 가능한 요약 + 상세) */}
                    <button
                        type="button"
                        className={styles.total_bar}
                        aria-expanded={openTotal}
                        onClick={() => setOpenTotal(v => !v)}
                    >
                        <span>결제금액</span>
                        <div className={styles.total_right}>
                            <strong>{totalPrice.toLocaleString()}원</strong>
                            {openTotal ? (
                                <Image src="/icons/fold_2.svg" alt="펼치기" width={12} height={12} />
                            ) : (
                                <Image src="/icons/fold_1.svg" alt="접기" width={12} height={12} />
                            )
                            }
                        </div>
                    </button>

                    {openTotal && (
                        <div className={styles.total_details}>
                            <div className={styles.row}>
                                <span>상품금액</span>
                                <span className={styles.price}>{productTotal.toLocaleString()}원</span>
                            </div>
                            <div className={styles.row}>
                                <span>배송비</span>
                                <span className={styles.price}>{shippingFee.toLocaleString()}원</span>
                            </div>
                            {previewCouponAmount > 0 && (
                                <div className={styles.row}>
                                    <span>쿠폰 할인</span>
                                    <span className={styles.price}>- {previewCouponAmount.toLocaleString()}원</span>
                                </div>
                            )}
                        </div>
                    )}

                    {openFastModal && <FastDeliveryModal onClose={() => setOpenFastModal(false)} />}
                    {openWarehouseModal && <WarehouseStorageModal onClose={() => setOpenWarehouseModal(false)} />}

                    <div className={styles.divider_horizontal}></div>
                    <p className={styles.notice}>
                        상품은 개인 또는 입점 사업자가 판매하며<br />
                        각 거래 조건 등은 판매자 정보를 통해 확인해주시기 바랍니다.
                    </p>
                </div>
            </section>
            <div className={styles.divider_horizontal}></div>
        </>
    )
}
