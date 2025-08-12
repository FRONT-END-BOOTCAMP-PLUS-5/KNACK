'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './SuccessPage.module.scss'
import requester from '@/utils/requester'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { OrderItem, SelectedAddress } from '@/types/order'

export default function PaymentSuccess() {
    const params = useSearchParams()
    const router = useRouter()
    const { data: session, status } = useSession()

    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null)
    const [paymentNumber, setPaymentNumber] = useState('')
    const [savedOrderIds, setSavedOrderIds] = useState<number[]>([])

    // ✅ URL 파라미터를 원시값으로 고정 (deps에 객체 params 대신 이 값들만 넣기)
    const tossPaymentKey = useMemo(() => params.get('paymentKey') ?? '', [params])
    const tossOrderId = useMemo(() => params.get('orderId') ?? '', [params])
    const amount = useMemo(() => {
        const raw = params.get('amount')
        const n = raw === null ? NaN : Number(raw)
        return n
    }, [params])

    // 1) sessionStorage에서 복구
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

    const hasRun = useRef(false)

    // 2) 결제 및 주문 저장
    useEffect(() => {
        // 디버그: 어떤 가드에서 막히는지 로그
        console.debug('[guard] session.status=', status, 'user=', !!session?.user)
        console.debug('[guard] selectedAddress.id=', selectedAddress?.id)
        console.debug('[guard] orderItems.length=', orderItems.length)
        console.debug('[guard] hasRun=', hasRun.current)
        console.debug('[guard] paymentKey/orderId/amount=', tossPaymentKey, tossOrderId, amount)

        if (status !== 'authenticated' || !session?.user) return
        if (!selectedAddress?.id) return
        if (orderItems.length === 0) return
        if (hasRun.current) return

        // ❗ amount 체크: 0원이 유효한 경우가 드물지만, 중요한 건 NaN 여부
        if (!tossPaymentKey || !tossOrderId || Number.isNaN(amount)) {
            console.warn('파라미터 부족: paymentKey/orderId/amount 확인 필요')
            return
        }

        const alreadyProcessed = sessionStorage.getItem('paymentProcessed') === 'true'
        if (alreadyProcessed) {
            console.warn('이미 처리된 결제입니다 (sessionStorage.paymentProcessed=true)')
            return
        }

        sessionStorage.setItem('paymentProcessed', 'true')
        hasRun.current = true

            ; (async () => {
                try {
                    console.log('➡️ 주문 저장 요청 /api/orders', { orderItems, addr: selectedAddress.id })
                    const orderRes = await requester.post('/api/orders', {
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
                    console.log('✅ 주문 저장 완료:', createdOrderIds)

                    console.log('➡️ 결제 확인/저장 요청 /api/payments')
                    const paymentRes = await requester.post('/api/payments', {
                        tossPaymentKey,
                        orderId: tossOrderId,
                        amount,
                        addressId: selectedAddress.id,
                        orderIds: createdOrderIds,
                    })

                    setPaymentNumber(String(paymentRes.data.paymentNumber ?? ''))
                    console.log('✅ 결제 저장 완료:', paymentRes.data.paymentNumber)

                    // 정리
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
    }, [
        status,
        session,
        selectedAddress,
        orderItems,
        tossPaymentKey,
        tossOrderId,
        amount,
        router,
    ])

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
