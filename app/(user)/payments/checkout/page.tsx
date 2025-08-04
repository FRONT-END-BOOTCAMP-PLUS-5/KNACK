// 📁 app/(payment)/checkout/page.tsx
'use client'

import { useState } from 'react'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import styles from './CheckoutPage.module.scss'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!

const PAYMENT_METHODS = [
    { label: '카드', value: '카드' },
    { label: '계좌이체', value: '계좌이체' },
    { label: '토스페이', value: '토스페이' },
    { label: '카카오페이', value: '카카오페이' },
    { label: '네이버페이', value: '네이버페이' },
]

export default function CheckoutPage() {
    const [method, setMethod] = useState<string>('카드')

    const handlePayment = async () => {
        try {
            const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)
            await tossPayments.requestPayment(method, {
                amount: 10000,
                orderId: `order_${Date.now()}`,
                orderName: '보드게임 결제',
                customerName: '홍길동',
                successUrl: `${window.location.origin}/payments/success`,
                failUrl: `${window.location.origin}/payments/fail`,
            })
        } catch (e) {
            alert('결제 오류가 발생했습니다.')
            console.error(e)
        }
    }

    return (
        <div className={styles.checkoutWrapper}>
            <h1 className={styles.title}>결제 방법</h1>
            <ul className={styles.methodList}>
                {PAYMENT_METHODS.map((m) => (
                    <li
                        key={m.value}
                        className={`${styles.methodItem} ${method === m.value ? styles.active : ''}`}
                        onClick={() => setMethod(m.value)}
                    >
                        {m.label}
                    </li>
                ))}
            </ul>

            <div className={styles.paymentInfo}>
                <p>상품명: 보드게임 결제</p>
                <p>결제금액: 10,000원</p>
            </div>

            <button onClick={handlePayment} className={styles.payButton}>결제하기</button>
        </div>
    )
}
