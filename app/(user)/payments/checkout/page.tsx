'use client'

import { useState } from 'react'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import styles from './CheckoutPage.module.scss'
import AddressBox from '@/components/Address/AddressBox'
import { useAddressStore } from '@/store/useAddressStore' // ✅ 추가

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!

const products = [
    { id: 'prod1', name: '보드게임 A', price: 15000 },
    { id: 'prod2', name: '보드게임 B', price: 22000 },
    { id: 'prod3', name: '보드게임 C', price: 30000 },
]

export default function CheckoutPage() {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const { selectedAddress } = useAddressStore() // ✅ zustand에서 선택된 주소 가져오기

    const toggleProduct = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        )
    }

    const totalAmount = products
        .filter((p) => selectedIds.includes(p.id))
        .reduce((sum, p) => sum + p.price, 0)

    const handlePayment = async () => {
        if (totalAmount === 0) {
            alert('상품을 선택해주세요.')
            return
        }

        if (!selectedAddress) {
            alert('주소지를 선택해주세요.')
            return
        }

        try {
            // ✅ 주소 로컬 저장 (선택사항)
            localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress))

            const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)

            await tossPayments.requestPayment('카드', {
                amount: totalAmount,
                orderId: `order_${Date.now()}`,
                orderName: '보드게임 묶음결제',
                customerName: selectedAddress.name || '홍길동',
                successUrl: `${window.location.origin}/payments/success`,
                failUrl: `${window.location.origin}/payments/failure`,
            })
        } catch (e) {
            console.error(e)
            alert('결제 실패')
        }
    }

    return (
        <main className={styles.checkout_container}>
            <h1>보드게임 결제</h1>

            <section className={styles.address_section}>
                <h3>배송지 선택</h3>
                <AddressBox />
            </section>

            <ul className={styles.product_list}>
                {products.map((product) => (
                    <li key={product.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(product.id)}
                                onChange={() => toggleProduct(product.id)}
                            />
                            {product.name} - {product.price.toLocaleString()}원
                        </label>
                    </li>
                ))}
            </ul>

            <div className={styles.summary}>
                <p>총 결제 금액: <strong>{totalAmount.toLocaleString()}원</strong></p>
                <button onClick={handlePayment}>결제하기</button>
            </div>
        </main>
    )
}
