// 📁 app/payments/failure/page.tsx
'use client'

import { use, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import requester from '@/utils/requester'
import styles from './FailPage.module.scss'
import { useUserStore } from '@/store/userStore'
import { OrderItem } from '@/types/order'
import { IAddress } from '@/types/address'

export default function PaymentFail() {
    const sp = useSearchParams()

    const { orderId, code, message } = useMemo(
        () => ({
            orderId: sp.get('orderId'),
            code: sp.get('code'),
            message: sp.get('message'),
        }),
        [sp]
    )

    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [address, setAddress] = useState<IAddress | null>(null)
    const [deliveryFee, setDeliveryFee] = useState<number>(0)
    const user = useUserStore(s => s.user)

    // sessionStorage에서 복구
    useEffect(() => {
        try {
            const rawItems = sessionStorage.getItem('orderItems')
            if (rawItems) {
                const parsed: OrderItem[] = JSON.parse(rawItems)
                setOrderItems(parsed)

                // 배송비 계산: FAST/fast/normal 이 하나라도 있으면 5,000원, 아니면 0원
                const hasFast =
                    parsed.some(it =>
                        ['FAST', 'fast', 'normal'].includes(String(it.deliveryType || '').toLowerCase())
                    )
                setDeliveryFee(0)
            }
        } catch (e) {
            console.error('❌ orderItems 파싱 실패:', e)
        }

        try {
            const rawAddress = sessionStorage.getItem('IAddress')
            if (rawAddress) setAddress(JSON.parse(rawAddress))
        } catch (e) {
            console.error('❌ IAddress 파싱 실패:', e)
        }
    }, [])

    const hasRun = useRef(false)

    useEffect(() => {
        const sendFailLog = async () => {
            if (!user || !address?.id || hasRun.current) return
            hasRun.current = true

            try {
                const priceSum =
                    orderItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0) + deliveryFee

                await requester.post('/api/payments/fail', {
                    orderIds: orderId ? [Number(orderId)] : [],
                    failureCode: code,
                    failureMessage: message,
                    method: 'TOSS',
                    userId: user.id,
                    addressId: address.id,
                    price: priceSum,
                })
            } catch (err) {
                console.error('결제 실패 로그 저장 오류:', err)
            }
        }

        sendFailLog()
    }, [orderId, code, message, user, address?.id, orderItems, deliveryFee])

    return (
        <div className={styles.fail}>
            <div className={styles.card}>
                <div className={styles.icon}>❌</div>
                <h2>결제가 실패했습니다</h2>
                <p>{message ?? '잠시 후 다시 시도해 주세요.'}</p>
                <button
                    className={styles.retry_btn}
                    onClick={() => (window.location.href = '/cart')}
                >
                    장바구니로 돌아가기
                </button>
            </div>
        </div>
    )
}
