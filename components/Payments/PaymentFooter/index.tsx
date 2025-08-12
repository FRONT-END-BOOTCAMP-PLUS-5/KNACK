'use client'

import React from 'react'
import styles from './paymentFooter.module.scss'
import { PaymentFooterProps } from '@/types/order'

export default function PaymentFooter({
    totalPrice,
    onPay,
    disabled = false,
}: PaymentFooterProps) {
    const formatPrice = (price: number) =>
        price.toLocaleString('ko-KR') + '원'

    return (
        <footer className={styles.payment_footer}>
            <div className={styles.payment_footer__inner}>
                <button className={styles.pay_btn} disabled={disabled} onClick={onPay}>
                    {formatPrice(totalPrice)} 결제하기
                </button>
            </div>
        </footer>
    )
}
