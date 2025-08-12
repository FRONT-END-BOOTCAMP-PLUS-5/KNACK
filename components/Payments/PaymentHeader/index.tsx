'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './paymentHeader.module.scss'
import Image from 'next/image'

export default function CheckoutHeader() {
    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    return (
        <header className={styles.checkout_header}>
            <a className={styles.btn_cancel} onClick={handleBack}>
                <Image src="/icons/header-back.svg" alt="" width={24} height={24} />
            </a>
            <div className={styles.inner}>
                <h1 className={styles.title}><span className={styles.title_txt}>배송/결제</span></h1>
            </div>
        </header>
    )
}
