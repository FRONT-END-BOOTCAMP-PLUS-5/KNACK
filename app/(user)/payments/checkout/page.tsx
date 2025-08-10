'use client'

import { useEffect, useMemo, useState } from 'react'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import styles from './CheckoutPage.module.scss'
import AddressBox from '@/components/Address/AddressBox'
import requester from '@/utils/requester'
import PaymentFooter from '@/components/Payments/PaymentFooter/PaymentFooter'
import OrderSummaryCard from '@/components/Payments/Order/OrderSummaryCard'
import PointSection from '@/components/Payments/Points/PointSection'
import FinalOrderSummary from '@/components/Payments/Order/FInalOrderSummary'
import { AddressDto } from '@/backend/address/applications/dtos/AddressDto'
import { IProduct } from '@/types/product'
import AddressModal from '@/components/Address/AddressModal'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!

type CheckoutRow = {
    productId: number
    quantity: number
    optionValueId?: number
    deliveryMethod: 'normal' | 'fast' | string
}

type OrderItem = {
    productId: number
    price: number
    quantity: number
    thumbnail_image: string
    deliveryType: string
    kor_name?: string
    eng_name?: string
}

export default function CheckoutPage() {
    // ----- Local UI States (Zustand 제거) -----
    const [checkout, setCheckout] = useState<CheckoutRow[]>([])
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [deliveryType, setDeliveryType] = useState<'FAST' | 'STOCK'>('FAST')
    const [deliveryFee, setDeliveryFee] = useState<number>(5000)
    const [points, setPoints] = useState<number>(0) // 사용 포인트
    const [selectedAddress, setSelectedAddress] = useState<{
        id: number
        name: string
        phone: string
        fullAddress: string
        request: string
    } | null>(null)
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

    // ----- load checkout from localStorage -----
    useEffect(() => {
        // localStorage는 클라에서만 접근 가능
        const raw = typeof window !== 'undefined' ? localStorage.getItem('checkout') : null
        if (!raw) return
        try {
            const parsed: CheckoutRow[] = JSON.parse(raw)
            setCheckout(parsed)
        } catch (e) {
            console.error('checkout 파싱 실패', e)
        }
    }, [])

    // ----- fetch products in batch & build orderItems -----
    useEffect(() => {
        if (!checkout.length) return
            ; (async () => {
                try {
                    const ids = checkout.map(c => c.productId)
                    const { data } = await requester.post('/api/products', { ids })
                    const results = data.results as (IProduct | null)[]

                    const items: OrderItem[] = results.flatMap((p, i) =>
                        p
                            ? [{
                                productId: p.id,
                                price: p.price,
                                quantity: checkout[i].quantity,
                                thumbnail_image: p.thumbnailImage,
                                deliveryType: checkout[i].deliveryMethod,
                                kor_name: p.korName,
                                eng_name: p.engName,
                            }]
                            : []
                    )

                    setOrderItems(items)
                    // 필요 시 성공 페이지용으로 보존
                    sessionStorage.setItem('orderItems', JSON.stringify(items))
                } catch (e) {
                    console.error('batch fetch failed:', e)
                }
            })()
    }, [checkout])

    // ----- fetch default address -----
    useEffect(() => {
        ; (async () => {
            try {
                const res = await requester.get('/api/addresses')
                const addresses: AddressDto[] = res.data
                const def = addresses.find(a => a.isDefault)
                if (def) {
                    const addr = {
                        id: def.id,
                        name: def.name,
                        phone: def.phone ?? '',
                        fullAddress: `${def.main} ${def.detail ?? ''}`.trim(),
                        request: def.message ?? '',
                    }
                    setSelectedAddress(addr)
                    sessionStorage.setItem('selectedAddress', JSON.stringify(addr))
                }
            } catch (err) {
                console.error('주소 불러오기 실패', err)
            }
        })()
    }, [])

    // ----- delivery controls -----
    const onChangeDelivery = (type: 'FAST' | 'STOCK') => {
        setDeliveryType(type)
        setDeliveryFee(type === 'FAST' ? 5000 : 0)
    }

    // ----- totals -----
    const priceWithoutDelivery = useMemo(
        () => orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
        [orderItems]
    )
    const couponAmount = 0 // 쿠폰 도입 시 교체
    const totalBeforePoints = useMemo(
        () => Math.max(0, priceWithoutDelivery + deliveryFee - couponAmount),
        [priceWithoutDelivery, deliveryFee, couponAmount]
    )
    const totalPrice = useMemo(
        () => Math.max(0, totalBeforePoints - points),
        [totalBeforePoints, points]
    )

    // ----- save request message -----
    const handleSaveRequestMessage = async () => {
        if (!selectedAddress?.id) {
            alert('주소가 선택되지 않았습니다.')
            return
        }
        try {
            await requester.patch(`/api/addresses/${selectedAddress.id}/message`, {
                requestMessage: selectedAddress.request,
            })
        } catch (e) {
            console.error('요청사항 저장 실패', e)
            alert('요청사항 저장 중 오류가 발생했습니다.')
        }
    }

    // ----- payment -----
    const handlePayment = async () => {
        if (!orderItems.length) return alert('상품을 선택해주세요.')
        if (!selectedAddress) return alert('주소지를 선택해주세요.')

        try {
            await handleSaveRequestMessage()

            const toss = await loadTossPayments(TOSS_CLIENT_KEY)
            console.log(toss);
            await toss.requestPayment('카드', {
                amount: totalPrice,
                orderId: `order_${Date.now()}`, // 권장: 서버에서 선발급한 orderNumber 사용
                orderName: `${orderItems[0]?.kor_name || orderItems[0]?.eng_name || '상품'} ${orderItems.length > 1 ? `외 ${orderItems.length - 1}개` : ''} 주문`,
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
            <section className={styles.address_section}>
                <AddressBox
                    selectedAddress={selectedAddress ?? null}
                    onOpenModal={() => setIsAddressModalOpen(true)}
                    onChangeRequest={(req) => {
                        if (!selectedAddress) return
                        setSelectedAddress({ ...selectedAddress, request: req }) // zustand 업데이트
                    }}
                />
            </section>

            {/* 주문 요약 카드: 여러 상품 렌더링하는 버전 사용 */}
            <OrderSummaryCard
                orderItems={orderItems}
                deliveryType={deliveryType}
                onChangeDelivery={(t) => {
                    setDeliveryType(t)
                    setDeliveryFee(t === 'FAST' ? 5000 : 0)
                }}
                totalPrice={totalPrice}
            />

            <PointSection
                availablePoints={100000 /* 보유 포인트 */}
                maxUsablePoints={totalBeforePoints}              // 🔥 추가
                onChange={(p) => setPoints(Math.max(0, Math.min(p, totalBeforePoints)))} // 🔥 캡 적용
            />

            <FinalOrderSummary
                price={priceWithoutDelivery}
                fee={0}
                shippingFee={deliveryFee}
                couponAmount={0}
                pointAmount={points}
            />

            <PaymentFooter totalPrice={totalPrice} onPay={handlePayment} />

            {isAddressModalOpen && (
                <AddressModal
                    onClose={() => setIsAddressModalOpen(false)}
                    selectedAddress={selectedAddress}
                    onChangeSelected={setSelectedAddress}
                />
            )}
        </main>
    )
}
