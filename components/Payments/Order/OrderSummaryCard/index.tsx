'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import styles from './orderSummaryCard.module.scss'
import { STORAGE_PATHS } from '@/constraint/auth'
import FastDeliveryModal from '@/components/Payments/Modals/FastDeliveryModal'
import WarehouseStorageModal from '@/components/Payments/Modals/WareHouseStorageModal'
import { OrderItem, OrderSummaryCardProps } from '@/types/order'
import CouponSelectModal from '../../CouponSelectModal'

export default function OrderSummaryCard({
    orderItems,
    deliveryType,
    onChangeDelivery,
    baseSum,
    shippingFee,
    couponDiscount,
    totalPayable,
    selectedCouponName = null,
    applicableCouponCount,
    onOpenCouponModal,
    onClearCoupon,
    onItemMenuClick,
}: OrderSummaryCardProps) {
    const [openTotal, setOpenTotal] = useState(true)
    const [openFastModal, setOpenFastModal] = useState(false)
    const [openWarehouseModal, setOpenWarehouseModal] = useState(false)

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

                    {/* 상품 목록 */}
                    <div className={styles.product_list}>
                        {orderItems.map((item: OrderItem, idx: number) => (
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
                                        <span className={styles.inline_icon}>
                                            <Image src="/icons/lightning.png" alt="체크" width={12} height={12} />
                                            빠른배송
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.price_wrap}>
                                    <div className={styles.price}>
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </div>
                                    <button
                                        className={styles.kebab}
                                        aria-label="메뉴"
                                        type="button"
                                        onClick={() => onItemMenuClick?.(item)}
                                    >
                                        ⋮
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 배송방법 */}
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
                                <div className={styles.sub}>
                                    검수 완료 · 내일 도착 예정{' '}
                                    <Image
                                        src="/icons/question_circle.png"
                                        alt="설명"
                                        width={17}
                                        height={17}
                                        onClick={() => setOpenFastModal(true)}
                                    />
                                </div>
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
                                <div className={styles.sub}>
                                    배송 없이 빠른 판매{' '}
                                    <Image
                                        src="/icons/question_circle.png"
                                        alt="설명"
                                        width={17}
                                        height={17}
                                        onClick={() => setOpenWarehouseModal(true)}
                                    />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* 쿠폰 (모달은 바깥에서 열고/닫음) */}
                    <div className={styles.section_title}>할인쿠폰</div>
                    <div className={styles.coupon_row2}>
                        <button
                            type="button"
                            className={`${styles.coupon_box} ${selectedCouponName ? styles.active : ''}`}
                            onClick={onOpenCouponModal}
                        >
                            <span className={styles.coupon_name}>
                                {selectedCouponName || `쿠폰 선택 (${applicableCouponCount}장)`}
                            </span>
                            <span className={styles.right}>
                                {couponDiscount > 0 ? (
                                    <span className={styles.discount}>- {couponDiscount.toLocaleString()}원</span>
                                ) : null}
                                {/* 우측 꺾쇠는 public/icons/chevron_right.svg 로 두거나 inline svg 사용 */}
                                <Image src="/icons/chevron_right.svg" alt="" width={16} height={16} />
                            </span>
                        </button>

                        {selectedCouponName && onClearCoupon ? (
                            <button type="button" className={styles.cancel_btn} onClick={onClearCoupon}>
                                사용 취소
                            </button>
                        ) : <button className={styles.cancel_btn} onClick={onOpenCouponModal}>쿠폰 선택</button>}
                    </div>

                    {/* 결제금액 (토글) */}
                    <button
                        type="button"
                        className={styles.total_bar}
                        aria-expanded={openTotal}
                        onClick={() => setOpenTotal(v => !v)}
                    >
                        <span>결제금액</span>
                        <div className={styles.total_right}>
                            <strong>{totalPayable.toLocaleString()}원</strong>
                            <Image
                                src={openTotal ? '/icons/fold_2.svg' : '/icons/fold_1.svg'}
                                alt="접기/펼치기"
                                width={12}
                                height={12}
                            />
                        </div>
                    </button>

                    {openTotal && (
                        <div className={styles.total_details}>
                            <div className={styles.row}>
                                <span>상품금액</span>
                                <span className={styles.price}>{baseSum.toLocaleString()}원</span>
                            </div>
                            <div className={styles.row}>
                                <span>배송비</span>
                                <span className={styles.price}>{shippingFee.toLocaleString()}원</span>
                            </div>
                            {couponDiscount > 0 && (
                                <div className={styles.row}>
                                    <span>쿠폰 할인</span>
                                    <span className={styles.price}>- {couponDiscount.toLocaleString()}원</span>
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
