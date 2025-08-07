'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './SuccessPage.module.scss'
import requester from '@/utils/requester'
import { useSession } from 'next-auth/react'
import { useOrderStore } from '@/store/useOrderStore'
import { useAddressStore } from '@/store/useAddressStore'
import axios from 'axios'

export default function PaymentSuccess() {
    const params = useSearchParams()
    const { data: session } = useSession()

    const { orderItems, setOrderItems } = useOrderStore()
    const { selectedAddress, setSelectedAddress } = useAddressStore()

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
    useEffect(() => {
        if (!session?.user || !params || orderItems.length === 0 || !selectedAddress?.id) return

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
                    })),
                })

                const savedOrderIds = orderRes.data.orderIds

                // 2. 결제 저장
                await requester.post('/api/payments', {
                    tossPaymentKey: paymentKey,
                    userId: session.user.id,
                    addressId,
                    amount,
                    approvedAt: new Date(),
                    method,
                    status: 'DONE',
                    orderIds: savedOrderIds,
                })

                console.log('✅ 결제 및 주문 저장 완료')

                // ✅ 3. 상태 초기화
                sessionStorage.removeItem('orderItems')
                sessionStorage.removeItem('selectedAddress')
                sessionStorage.clear() // 또는 위 두 줄만

            } catch (err) {
                console.error('❌ 결제 저장 실패', err)
                if (axios.isAxiosError(err)) {
                    console.error('📛 서버 응답:', err.response?.data)
                }
            }
        }

        save()
    }, [params, session, orderItems, selectedAddress])

    return (
        <div className={styles.success}>
            <h2>✅ 결제가 완료되었습니다.</h2>
        </div>
    )
}
