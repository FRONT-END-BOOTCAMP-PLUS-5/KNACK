'use client'

import React from 'react'
import { useOrderStore } from '@/store/useOrderStore'
import styles from './OrderSummaryCard.module.scss'
import Image from 'next/image'
import { STORAGE_PATHS } from '@/constraint/auth'

export default function OrderSummaryCard() {
    const {
        orderItems,
        deliveryType,
        setDeliveryType,
        getTotalPrice,
    } = useOrderStore()

    const totalPrice = getTotalPrice()

    if (!orderItems?.length) return <div>주문 상품이 없습니다.</div>

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>주문 상품 및 쿠폰</h3>
                <span className={styles.item_count}>총 {orderItems.length}건</span>
            </div>

            <div className={styles.coupon_toggle}>
                <span>적용할 쿠폰이 없습니다</span>
                <label className={styles.switch}>
                    <input type="checkbox" disabled />
                    <span className={styles.slider}></span>
                </label>
            </div>

            {/* ✅ 여러 상품 리스트 */}
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
                            <div className={styles.model}>상품번호: #{item.productId}</div>
                            <div className={styles.points}>수량 {item.quantity}개</div>
                        </div>
                        <div className={styles.price}>
                            {(item.price * item.quantity).toLocaleString()}원
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.delivery}>
                <div className={styles.delivery_label}>배송방법</div>

                <label className={styles.radio_option}>
                    <input
                        type="radio"
                        name="delivery"
                        value="FAST"
                        checked={deliveryType === 'FAST'}
                        onChange={() => setDeliveryType('FAST', 5000)}
                    />
                    <span className={styles.custom_radio}></span>
                    <div className={styles.radio_text}>
                        <div className={styles.main}>빠른배송</div>
                        <div className={styles.sub}>검수 완료 · 내일 도착 예정</div>
                    </div>
                </label>

                <label className={styles.radio_option}>
                    <input
                        type="radio"
                        name="delivery"
                        value="STOCK"
                        checked={deliveryType === 'STOCK'}
                        onChange={() => setDeliveryType('STOCK', 0)}
                    />
                    <span className={styles.custom_radio}></span>
                    <div className={styles.radio_text}>
                        <div className={styles.main}>창고보관</div>
                        <div className={styles.sub}>배송 없이 빠른 판매</div>
                    </div>
                </label>
            </div>

            <div className={styles.coupon}>
                <input type="text" disabled value="사용 가능한 쿠폰이 없습니다." />
                <button disabled>쿠폰 선택</button>
            </div>

            <div className={styles.total}>
                <span>결제금액</span>
                <strong>{totalPrice.toLocaleString()}원</strong>
            </div>

            <p className={styles.notice}>
                상품은 개인 또는 입점 사업자가 판매하며<br />
                각 거래 조건 등은 판매자 정보를 통해 확인해주시기 바랍니다.
            </p>
        </div>
    )
}
