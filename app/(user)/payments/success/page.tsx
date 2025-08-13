'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './SuccessPage.module.scss'
import requester from '@/utils/requester'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { Coupon, OrderItem, SelectedAddress } from '@/types/order'
import Image from 'next/image'
import { STORAGE_PATHS } from '@/constraint/auth'

type RepresentativeProduct = {
    productId: number | null
    name: string
    thumbnailUrl: string | null
    unitPrice: number
    quantity: number
    lineTotal: number
}

export default function PaymentSuccess() {
    const params = useSearchParams()
    const router = useRouter()
    const { data: session, status } = useSession()

    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null)
    const [paymentNumber, setPaymentNumber] = useState('')
    const [savedOrderIds, setSavedOrderIds] = useState<number[]>([])
    const [paymentId, setPaymentId] = useState<number | null>(null)
    const [repProd, setRepProd] = useState<RepresentativeProduct | null>(null)
    const [shippingFee, setShippingFee] = useState(0)
    const [otherOrdersCount, setOtherOrdersCount] = useState(0)
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>()
    const [pointsToUse, setPointsToUse] = useState(0)
    const [discountAmount, setDiscountAmount] = useState(0)

    // ✅ URL 파라미터를 원시값으로 고정
    const tossPaymentKey = useMemo(() => params.get('paymentKey') ?? '', [params])
    const tossOrderId = useMemo(() => params.get('orderId') ?? '', [params])
    const amount = useMemo(() => {
        const raw = params.get('amount')
        const n = raw === null ? NaN : Number(raw)
        return n
    }, [params])

    // 총액(파라미터), 구매가(subtotal), 수수료 계산
    const totalAmount = useMemo(() => (Number.isFinite(amount) ? Number(amount) : 0), [amount])
    const subtotal = useMemo(
        () => orderItems.reduce((s, it) => s + Number(it.price ?? 0) * Number(it.quantity ?? 0), 0),
        [orderItems]
    )
    const fee = useMemo(() => Math.max(0, totalAmount - subtotal - shippingFee), [totalAmount, subtotal, shippingFee])


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
        try {
            const rawCoupon = sessionStorage.getItem('selectedCoupon')
            if (rawCoupon) setSelectedCoupon(JSON.parse(rawCoupon))
        } catch (e) {
            console.error('❌ selectedCouponId 파싱 실패:', e)
        }
        try {
            const rawPoints = sessionStorage.getItem('pointAmount')
            if (rawPoints) setPointsToUse(Number(rawPoints))
        } catch (e) {
            console.error('❌ pointAmount 파싱 실패:', e)
        }
        try {
            const rawDiscount = sessionStorage.getItem('couponDiscountAmount')
            if (rawDiscount) setDiscountAmount(Number(rawDiscount))
        } catch (e) {
            console.error('❌ couponDiscountAmount 파싱 실패:', e)
        }
        try {
            const rawShipping = sessionStorage.getItem('shippingfee')
            if (rawShipping) setShippingFee(Number(rawShipping))
        } catch (e) {
            console.error('❌ shippingfee 파싱 실패:', e)
        }
    }, [])

    const hasRun = useRef(false)

    // 2) 결제 및 주문 저장
    useEffect(() => {
        console.debug('[guard] session.status=', status, 'user=', !!session?.user)
        console.debug('[guard] selectedAddress.id=', selectedAddress?.id)
        console.debug('[guard] orderItems.length=', orderItems.length)
        console.debug('[guard] hasRun=', hasRun.current)
        console.debug('[guard] paymentKey/orderId/amount=', tossPaymentKey, tossOrderId, amount)

        if (status !== 'authenticated' || !session?.user) return
        if (!selectedAddress?.id) return
        if (orderItems.length === 0) return
        if (hasRun.current) return
        if (!tossPaymentKey || !tossOrderId || Number.isNaN(amount)) return

        const alreadyProcessed = sessionStorage.getItem('paymentProcessed') === 'true'
        if (alreadyProcessed) return

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
                        selectedCouponId: selectedCoupon?.id ?? null,
                        pointsToUse: pointsToUse,
                    })

                    // ⚓ paymentId + paymentNumber 확보
                    const pid: number | null = paymentRes.data?.id ?? null
                    console.log(pid);
                    setPaymentId(pid)
                    setPaymentNumber(String(paymentRes.data.paymentNumber ?? ''))
                    console.log('✅ 결제 저장 완료:', { paymentNumber: paymentRes.data.paymentNumber, id: pid })

                    // 정리
                    sessionStorage.removeItem('orderItems')
                    sessionStorage.removeItem('selectedAddress')
                } catch (err) {
                    console.error('❌ 결제/주문 저장 실패', err)
                    if (axios.isAxiosError(err)) console.error('📛 서버 응답:', err.response?.data)
                    sessionStorage.removeItem('paymentProcessed')
                    hasRun.current = false
                    router.replace('/payments/failure')
                }
            })()
    }, [status, session, selectedAddress, orderItems, tossPaymentKey, tossOrderId, amount, router, pointsToUse, selectedCoupon?.id, subtotal])

    // 3) 대표상품 조회 (위에서 저장한 paymentId로 API 호출)
    useEffect(() => {
        if (!paymentId) return

        const pickRepFromItems = (items: OrderItem[]) => {
            const scored = (items ?? []).map((it) => {
                const unit =
                    Number.isFinite(it?.price) ? Number(it.price)
                        : Number.isFinite(it?.price) ? Number(it.price)
                            : Number(it?.price ?? 0)
                const qty = Number(it?.quantity ?? 0)
                return {
                    productId: it.productId ?? null,
                    name: it.kor_name ?? it.eng_name ?? '',
                    thumbnailUrl: it.thumbnail_image ?? null,
                    unitPrice: unit,
                    quantity: qty,
                    lineTotal: unit * qty,
                }
            })
            scored.sort((a, b) => (b.lineTotal ?? 0) - (a.lineTotal ?? 0))
            return scored[0] ?? null
        }

            ; (async () => {
                try {
                    // 1) 결제 → 첫 주문 ID + ‘외 N건’
                    const payRes = await requester.get(`/api/payments/${paymentId}`)
                    console.log(payRes)
                    let orderIds: number[] = payRes.data?.orderIds ?? []
                    if ((!orderIds || orderIds.length === 0) && Array.isArray(payRes.data?.orders)) {
                        orderIds = payRes.data.orders.map((o: { id: number }) => o.id).filter((v: number) => Number.isFinite(v))
                    }
                    setOtherOrdersCount(Math.max(0, (orderIds?.length ?? 0) - 1))

                    const firstOrderId = orderIds?.[0]
                    if (!Number.isFinite(firstOrderId)) {
                        setRepProd(null)
                        setShippingFee(0)
                        return
                    }

                    // 2) 첫 주문 상세 → 대표상품 + 배송비
                    const ordRes = await requester.get(`/api/orders/${firstOrderId}`)
                    const order = ordRes.data
                    console.log(order)
                    const items = order?.items ?? order?.orderItems ?? []
                    setRepProd(pickRepFromItems(items))

                    const delivery = Number(order?.deliveryFee ?? order?.shippingFee ?? 0)
                    setShippingFee(Number.isFinite(delivery) ? delivery : 0)
                } catch (e) {
                    console.error('❌ 대표상품/주문 로드 실패', e)
                    setRepProd(null)
                    setShippingFee(0)
                }
            })()
    }, [paymentId])

    const fmt = (n: number) => n.toLocaleString()

    return (
        <div className={styles.sheet}>
            {/* 닫기 아이콘이 필요하면 onClick에 원하는 경로로 */}
            {/* <button className={styles.close} aria-label="닫기" onClick={() => router.push('/')}>×</button> */}

            <h2 className={styles.title}>구매가 완료되었습니다.</h2>
            <p className={styles.subtitle}>주문 즉시 출고를 준비하여 안전하게 배송 될 예정입니다.</p>

            <div className={styles.image_wrap}>
                {repProd?.thumbnailUrl && (
                    <Image
                        src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${repProd.thumbnailUrl}`}
                        alt={repProd.name}
                        width={160}
                        height={160}
                        className={styles.productImage}
                    />
                )}
            </div>

            <button className={styles.primary_btn} onClick={() => router.push('/orders')}>
                구매 내역 상세보기
            </button>
            <p className={styles.notice}>구매 후 15분 이내에 구매 여부를 결정할 수 있습니다.</p>

            {/* 결제 요약 */}
            <section className={styles.summary_box}>
                <div className={styles.summary_header}>
                    <span>총 결제금액</span>
                    <strong>{fmt(totalAmount)}원</strong>
                </div>

                <div className={styles.row}>
                    <div>구매가{otherOrdersCount > 0 && <span className={styles.etc}> 외 {otherOrdersCount}건</span>}</div>
                    <div>{fmt(subtotal)}원</div>
                </div>

                <div className={styles.row}>
                    <div>배송비</div>
                    <div>{shippingFee > 0 ? `${fmt(shippingFee)}원` : '무료'}</div>
                </div>

                <div className={styles.row}>
                    <div>쿠폰 사용</div>
                    <div>{selectedCoupon ? `-${fmt(discountAmount)}원` : '-'}</div>
                </div>

                <div className={styles.row}>
                    <div>포인트 사용</div>
                    <div>{pointsToUse > 0 ? `-${fmt(pointsToUse)}P` : '-'}</div>
                </div>
            </section>
        </div>
    )
}
