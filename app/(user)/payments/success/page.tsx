'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './SuccessPage.module.scss'
import requester from '@/utils/requester' // 📌 경로 맞춰서 수정
import { useSession } from 'next-auth/react'

export default function PaymentSuccess() {
    const params = useSearchParams()
    const { data: session } = useSession()

    useEffect(() => {
        if (!session?.user || !params) return;

        const paymentKey = params.get('paymentKey')
        const orderId = params.get('orderId')
        const amount = Number(params.get('amount'))
        const orderIdList = params.get('orders')?.split(',').map(Number) || [1, 2, 3]
        const price = Number(params.get('price'))
        const method = params.get('method') || 'CARD'

        const paymentDto = {
            userId: session.user.id,
            addressId: 1,
            price,
            paymentKey,
            orderId,
            amount,
            approvedAt: new Date(),
            method,
            status: 'DONE',
            orderIds: orderIdList,
        }

        requester.post('/api/payments', paymentDto)
            .then(() => console.log("✅ 결제 저장 성공"))
            .catch((err) => console.error("❌ 결제 저장 실패", err))

    }, [params, session])

    return (
        <div className={styles.success}>
            <h2>✅ 결제가 완료되었습니다.</h2>
        </div>
    )
}
