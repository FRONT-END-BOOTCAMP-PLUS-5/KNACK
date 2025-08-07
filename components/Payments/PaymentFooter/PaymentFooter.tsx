'use client'

import React from 'react'
import styles from './paymentFooter.module.scss'

interface PaymentFooterProps {
    totalPrice: number
    onPay: () => void
    disabled?: boolean
}

export default function PaymentFooter({
    totalPrice,
    onPay,
    disabled = false,
}: PaymentFooterProps) {
    const formatPrice = (price: number) =>
        price.toLocaleString('ko-KR') + '원'

    return (
        <footer className={styles.payment_footer}>
            <button className={styles.pay_btn} onClick={onPay} disabled={disabled}>
                {formatPrice(totalPrice)} · 결제하기
            </button>
        </footer>
    )
}
