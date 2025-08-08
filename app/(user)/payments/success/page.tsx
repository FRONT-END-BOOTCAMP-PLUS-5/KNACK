'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './SuccessPage.module.scss'
import requester from '@/utils/requester'
import { useSession } from 'next-auth/react'
import { useOrderStore } from '@/store/useOrderStore'
import { useAddressStore } from '@/store/useAddressStore'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function PaymentSuccess() {
    const params = useSearchParams()
    const { data: session } = useSession()

    const router = useRouter()

    const { orderItems, setOrderItems } = useOrderStore()
    const { selectedAddress, setSelectedAddress } = useAddressStore()
    const [savedOrderIds, setSavedOrderIds] = useState<number[]>([]);
    const [paymentNumber, setPaymentNumber] = useState('')

    // ✅ 1. sessionStorage에서 상태 복구
    useEffect(() => {
        const rawItems = sessionStorage.getItem('orderItems')
        const rawAddress = sessionStorage.getItem('selectedAddress')

        if (rawItems) {
            try {
                setOrderItems(JSON.parse(rawItems))
            } catch (e) {
                console.error('❌ orderItems 파싱 실패:', e)
            }
        }

        if (rawAddress) {
            try {
                setSelectedAddress(JSON.parse(rawAddress))
            } catch (e) {
                console.error('❌ selectedAddress 파싱 실패:', e)
            }
        }
    }, [setOrderItems, setSelectedAddress])

    // ✅ 2. 결제 및 주문 저장

    const hasRun = useRef(false)

    useEffect(() => {
        console.log(session?.user, params, orderItems, selectedAddress)
        if (!session?.user || !params || orderItems.length === 0 || !selectedAddress?.id || hasRun.current) return

        hasRun.current = true

        const alreadyProcessed = sessionStorage.getItem('paymentProcessed') === 'true'
        if (alreadyProcessed) return
        sessionStorage.setItem('paymentProcessed', 'true')

        const paymentKey = params.get('paymentKey')
        const orderId = params.get('orderId')
        const amount = Number(params.get('amount'))
        const price = Number(params.get('price'))
        const method = params.get('method') || 'CARD'
        const addressId = selectedAddress.id

        const save = async () => {
            try {
                // 1. 주문 먼저 저장
                const orderRes = await requester.post('/api/order', {
                    userId: session.user.id,
                    items: orderItems.map((item) => ({
                        productId: item.productId,
                        price: item.price,
                        salePrice: item.price,
                        count: item.quantity,
                        addressId,
                        paymentId: null,
                    })),
                })

                const createdOrderIds: number[] = orderRes.data.orderIds || []
                setSavedOrderIds(orderRes.data.orderIds)

                // 2. 결제 저장
                const paymentRes = await requester.post('/api/payments', {
                    tossPaymentKey: paymentKey,
                    orderId: orderId,
                    userId: session.user.id,
                    addressId,
                    amount,
                    approvedAt: new Date(),
                    method,
                    status: 'DONE',
                    orderIds: createdOrderIds,
                })
                console.log(paymentRes)
                setPaymentNumber(paymentRes.data.paymentNumber)

                console.log('✅ 결제 및 주문 저장 완료')

                // ✅ 3. 상태 초기화
                sessionStorage.removeItem('orderItems')
                sessionStorage.removeItem('selectedAddress')
                sessionStorage.clear() // 또는 위 두 줄만

            } catch (err) {
                console.error('❌ 결제 저장 실패', err)
                if (axios.isAxiosError(err)) {
                    console.error('📛 서버 응답:', err.response?.data)
                    sessionStorage.removeItem('paymentProcessed')
                }
            }
        }

        save()
    }, [params, session, orderItems, selectedAddress, setSavedOrderIds, savedOrderIds, setPaymentNumber])

    // useEffect(() => {
    //     if (savedOrderIds.length < 1) {
    //         // 주문번호 없으면 주문내역 페이지로 바로 이동
    //         router.replace('/orders')
    //     }
    // }, [router, savedOrderIds])

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
                <button
                    className={styles.view_btn}
                    onClick={() => router.push(`/orders`)}
                >
                    주문 내역 확인
                </button>
            </div>
        </div>
    )
}

