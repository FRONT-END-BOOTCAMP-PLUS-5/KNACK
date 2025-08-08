'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './SuccessPage.module.scss'
import requester from '@/utils/requester'
import { useSession } from 'next-auth/react'
import axios from 'axios'

type OrderItem = {
    productId: number
    price: number
    quantity: number
}

type SelectedAddress = {
    id: number
    name: string
    phone?: string
    fullAddress?: string
    request?: string
}

export default function PaymentSuccess() {
    const params = useSearchParams()
    const router = useRouter()
    const { data: session } = useSession()

    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null)
    const [paymentNumber, setPaymentNumber] = useState('')
    const [savedOrderIds, setSavedOrderIds] = useState<number[]>([])

    // 1) sessionStorage에서 복구 (Zustand 제거)
    useEffect(() => {
        try {
            const rawItems = sessionStorage.getItem('orderItems')
            if (rawItems) setOrderItems(JSON.parse(rawItems))
        } catch (e) {
            console.error('❌ orderItems 파싱 실패:', e)
        }
        try {
            const rawAddress = sessionStorage.getItem('selectedAddress')
            if (rawAddress) setSelectedAddress(JSON.parse(rawAddress))
        } catch (e) {
            console.error('❌ selectedAddress 파싱 실패:', e)
        }
    }, [])

    // 2) 결제 및 주문 저장
    const hasRun = useRef(false)

    useEffect(() => {
        if (!session?.user) return
        if (!selectedAddress?.id) return
        if (orderItems.length === 0) return
        if (hasRun.current) return

        const paymentKey = params.get('paymentKey')
        const tossOrderId = params.get('orderId')
        const amount = Number(params.get('amount') ?? 0)
        if (!paymentKey || !tossOrderId || !amount) return

        const alreadyProcessed = sessionStorage.getItem('paymentProcessed') === 'true'
        if (alreadyProcessed) return
        sessionStorage.setItem('paymentProcessed', 'true')
        hasRun.current = true

            ; (async () => {
                try {
                    // 1) 주문 저장
                    const orderRes = await requester.post('/api/order', {
                        userId: session.user.id,
                        items: orderItems.map((item) => ({
                            productId: item.productId,
                            price: item.price,
                            salePrice: item.price,
                            count: item.quantity,
                            addressId: selectedAddress.id,
                            paymentId: null,
                        })),
                    })
                    const createdOrderIds: number[] = orderRes.data.orderIds || []
                    setSavedOrderIds(createdOrderIds)

                    // 2) 결제 확인/저장 (서버에서 Toss confirm + DB 저장)
                    const paymentRes = await requester.post('/api/payments/confirm', {
                        paymentKey,           // toss paymentKey
                        orderId: tossOrderId, // toss orderId
                        amount,               // 결제 금액
                        addressId: selectedAddress.id,
                        orderIds: createdOrderIds,
                    })

                    setPaymentNumber(String(paymentRes.data.paymentNumber ?? ''))

                    // 3) 상태 정리 (필요한 키만)
                    sessionStorage.removeItem('orderItems')
                    sessionStorage.removeItem('selectedAddress')
                } catch (err) {
                    console.error('❌ 결제/주문 저장 실패', err)
                    if (axios.isAxiosError(err)) {
                        console.error('📛 서버 응답:', err.response?.data)
                    }
                    sessionStorage.removeItem('paymentProcessed')
                    hasRun.current = false
                    router.replace('/payments/failure')
                }
            })()
    }, [session, params, selectedAddress, orderItems, router])

    return (
        <div className={styles.success}>
            <div className={styles.card}>
                <div className={styles.icon}>✅</div>
                <h2>결제가 완료되었습니다!</h2>
                {paymentNumber && (
                    <p className={styles.order_number}>
                        주문번호 <strong>{paymentNumber}</strong>
                    </p>
                )}
                <p className={styles.desc}>주문 내역은 아래 버튼을 눌러 확인할 수 있습니다.</p>
                <button className={styles.view_btn} onClick={() => router.push('/orders')}>
                    주문 내역 확인
                </button>
            </div>
        </div>
    )
}
