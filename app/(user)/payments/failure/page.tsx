// 📁 app/payments/failure/page.tsx
'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import requester from '@/utils/requester' // axios 인스턴스 import
import styles from './FailPage.module.scss'
import { useSession } from 'next-auth/react'
import { useOrderStore } from '@/store/useOrderStore'
import { useAddressStore } from '@/store/useAddressStore'

export default function PaymentFail() {
    const sp = useSearchParams()
    const { data: session } = useSession()

    const { orderId, code, message } = useMemo(
        () => ({
            orderId: sp.get('orderId'),
            code: sp.get('code'),
            message: sp.get('message'),
        }),
        [sp]
    )

    const { orderItems, setOrderItems, deliveryFee } = useOrderStore()
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

    const hasRun = useRef(false)

    useEffect(() => {
        const sendFailLog = async () => {
            if (!session?.user || !selectedAddress?.id || hasRun.current) return

            hasRun.current = true

            try {
                await requester.post('/api/payments/fail', {
                    orderIds: orderId ? [Number(orderId)] : [],
                    failureCode: code,
                    failureMessage: message,
                    method: 'TOSS',
                    userId: session.user.id,
                    addressId: selectedAddress.id,
                    price: orderItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0) + deliveryFee,
                    // 필요한 경우 userId, addressId, price 등 보강
                })
            } catch (err) {
                console.error('결제 실패 로그 저장 오류:', err)
            }
        }

        sendFailLog()
    }, [orderId, code, message, session?.user, selectedAddress?.id, orderItems, deliveryFee])

    return (
        <div className={styles.fail}>
            <div className={styles.card}>
                <div className={styles.icon}>❌</div>
                <h2>결제가 실패했습니다</h2>
                <p>{message ?? '잠시 후 다시 시도해 주세요.'}</p>
                <button
                    className={styles.retry_btn}
                    onClick={() => window.location.href = '/cart'}
                >
                    장바구니로 돌아가기
                </button>
            </div>
        </div>
    )
}
