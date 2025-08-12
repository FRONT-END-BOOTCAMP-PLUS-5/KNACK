'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './SuccessPage.module.scss'
import requester from '@/utils/requester'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { OrderItem, SelectedAddress } from '@/types/order'
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
    const [otherOrdersCount, setOtherOrdersCount] = useState(0)

    // ✅ URL 파라미터를 원시값으로 고정
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

    // 3) 대표상품 조회 (위에서 저장한 paymentId로 API 호출)
    useEffect(() => {
        if (!paymentId) return;

        const pickRepFromItems = (items: OrderItem[]) => {
            const scored = (items ?? []).map((it) => {
                const unit =
                    Number.isFinite(it?.price) ? Number(it.price)
                        : Number.isFinite(it?.price) ? Number(it.price)
                            : Number(it?.price ?? 0);
                const qty = Number(it?.quantity ?? 0);
                const lineTotal = unit * qty;
                return {
                    productId: it.productId ?? null,
                    name: it.kor_name ?? it.eng_name ?? '',
                    thumbnailUrl: it.thumbnail_image ?? null,
                    unitPrice: unit,
                    quantity: qty,
                    lineTotal,
                };
            });
            scored.sort((a, b) => (b.lineTotal ?? 0) - (a.lineTotal ?? 0));
            return scored[0] ?? null;
        };

        (async () => {
            try {
                // 1) 결제 정보에서 첫 주문 ID 얻기
                const payRes = await requester.get(`/api/payments/${paymentId}`);
                // 백엔드가 orderIds를 바로 주는 경우 우선 사용
                let orderIds: number[] = payRes.data?.orderIds ?? [];
                // 없다면 orders 배열에서 id만 추출 (구조 대비)
                if ((!orderIds || orderIds.length === 0) && Array.isArray(payRes.data?.orders)) {
                    orderIds = payRes.data.orders.map((o: { id: number }) => o.id).filter((v: number) => Number.isFinite(v));
                }
                const firstOrderId = orderIds?.[0];
                setOtherOrdersCount(Math.max(0, orderIds.length - 1))
                if (!Number.isFinite(firstOrderId)) {
                    console.warn('첫 주문을 찾을 수 없습니다.', payRes.data);
                    setRepProd(null);
                    return;
                }

                // 2) 첫 주문 상세 조회
                const ordRes = await requester.get(`/api/orders/${firstOrderId}`);
                const order = ordRes.data;

                // 3) 대표상품 계산 (items 키 이름 변동 대비)
                const items =
                    order?.items ??
                    order?.orderItems ??
                    []; // 스키마에 맞게 조정
                const rep = pickRepFromItems(items);
                setRepProd(rep);

                console.log('✅ 대표상품 로드 (from order)', rep);
            } catch (e) {
                console.error('❌ 대표상품 로드 실패', e);
                setRepProd(null);
            }
        })();
    }, [paymentId]);

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

                {/* 대표상품 박스 */}
                {repProd && (
                    <div className={styles.repBox}>
                        {repProd.thumbnailUrl && (
                            <Image
                                className={styles.rep_thumb}
                                src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${repProd.thumbnailUrl}`}
                                alt={repProd.name}
                                width={64}
                                height={64}
                            />
                        )}
                        <div className={styles.rep_info}>
                            <div className={styles.rep_name}>{repProd.name} {otherOrdersCount > 0 && (
                                <span className={styles.plus_etc}> 외 {otherOrdersCount}건</span>
                            )}</div>
                            <div className={styles.rep_meta}>
                                수량 {repProd.quantity} · 합계 {repProd.lineTotal.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                )}

                <p className={styles.desc}>주문 내역은 아래 버튼을 눌러 확인할 수 있습니다.</p>
                <button className={styles.view_btn} onClick={() => router.push('/orders')}>
                    주문 내역 확인
                </button>
            </div>
        </div>
    )
}
