'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './PaymentHeader.module.scss'

export default function CheckoutHeader() {
    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    return (
        <header className={styles.checkout_header}>
            <button className={styles.back_btn} onClick={handleBack}>
                ←
            </button>
            <h1 className={styles.title}>배송/결제</h1>
        </header>
    )
}
