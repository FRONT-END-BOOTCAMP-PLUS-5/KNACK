'use client'

import React, { useMemo } from 'react'
import styles from './CouponSelectModal.module.scss'
import Image from 'next/image'
import type { CouponSelectModalProps } from '@/types/order'

export default function CouponSelectModal({
    isOpen,
    onClose,
    coupons,
    orderItems,
    selectedCouponId,
    onSelectCoupon
}: CouponSelectModalProps) {
    const productSet = useMemo(() => new Set(orderItems.map(i => i.productId)), [orderItems])

    const applicable = useMemo(
        () => (coupons ?? []).filter(c => productSet.has(c.productId)),
        [coupons, productSet]
    )

    if (!isOpen) return null

    return (
        <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="쿠폰 선택">
            <div className={styles.sheet}>
                <header className={styles.header}>
                    <h3>쿠폰</h3>
                    <button className={styles.close} onClick={onClose} aria-label="닫기">✕</button>
                </header>

                {applicable.length === 0 ? (
                    <div className={styles.empty}>적용 가능한 쿠폰이 없습니다.</div>
                ) : (
                    <ul className={styles.list}>
                        {applicable.map(c => (
                            <li className={styles.card} key={c.id}>
                                <div className={styles.left}>
                                    <div className={styles.percent}>{c.salePercent}%</div>
                                    <div className={styles.title}>
                                        <strong>{c.name}</strong>
                                        <span className={styles.brandTag}>브랜드</span>
                                        <ul className={styles.bullets}>
                                            <li>브랜드배송 선택 시 사용가능</li>
                                            <li>일부 상품 제외</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={styles.cutline} aria-hidden="true" />

                                <div className={styles.right}>
                                    <div className={styles.dday}>
                                        <span className={styles.d}>D-5</span>
                                        <span className={styles.until}>{c.expirationAt ?? ''}</span>
                                    </div>
                                    {selectedCouponId === c.id ? (
                                        <button className={`${styles.btn} ${styles.selected}`} disabled>쿠폰 선택됨</button>
                                    ) : (
                                        <button
                                            className={styles.btn}
                                            onClick={() => {
                                                onSelectCoupon(Number(c.id))
                                                onClose()
                                            }}
                                        >
                                            쿠폰 선택
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <footer className={styles.footer}>
                    <button
                        className={styles.clear}
                        onClick={() => {
                            onSelectCoupon(null)
                            onClose()
                        }}
                    >
                        선택 안함
                    </button>
                </footer>
            </div>
        </div>
    )
}
