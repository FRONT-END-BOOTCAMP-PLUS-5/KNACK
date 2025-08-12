'use client'

import { useEffect, useMemo, useState } from 'react'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import styles from './CheckoutPage.module.scss'
import AddressBox from '@/components/address/AddressBox'
import requester from '@/utils/requester'
import PaymentFooter from '@/components/payments/PaymentFooter'
import OrderSummaryCard from '@/components/payments/Order/OrderSummaryCard'
import PointSection from '@/components/payments/Points'
import FinalOrderSummary from '@/components/payments/Order/FinalOrderSummary'
import { AddressDto } from '@/backend/address/applications/dtos/AddressDto'
import { IProduct } from '@/types/product'
import AddressModal from '@/components/address/AddressModal'
import { formatFullAddress } from '@/utils/openKakaoPostCode'
import RequestModal from '@/components/address/RequestModal'
import { AddressDtoWithPostalFields, AvailableCoupon, CheckoutRow, OrderItem } from '@/types/order'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!

export default function CheckoutPage() {
    // ----- Local UI States (Zustand 제거) -----
    const [checkout, setCheckout] = useState<CheckoutRow[]>([])
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])
    const [deliveryType, setDeliveryType] = useState<'FAST' | 'STOCK'>('FAST')
    const [deliveryFee, setDeliveryFee] = useState<number>(5000)

    // ✅ 포인트/쿠폰 상태
    const [availablePoints, setAvailablePoints] = useState<number>(0)
    const [points, setPoints] = useState<number>(0) // 사용 포인트
    const [coupons, setCoupons] = useState<AvailableCoupon[]>([])
    const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null)

    const [selectedAddress, setSelectedAddress] = useState<{
        id: number
        name: string
        phone: string
        fullAddress: string
        request: string
        postalCode?: string;
    } | null>(null)
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [isReqOpen, setReqOpen] = useState(false);

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

    // ✅ 쿠폰 할인액 계산 (선택된 1장의 퍼센트 할인)
    const couponAmount = useMemo(() => {
        if (!selectedCouponId) return 0
        const coupon = coupons.find(c => c.couponId === selectedCouponId)
        if (!coupon) return 0
        const targetSum = orderItems
            .filter(i => i.productId === coupon.productId)
            .reduce((s, i) => s + i.price * i.quantity, 0)
        return Math.max(0, Math.floor(targetSum * (coupon.salePercent / 100)))
    }, [selectedCouponId, coupons, orderItems])

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

            // ✅ 성공 페이지에서 보여주려면 세션에 저장
            sessionStorage.setItem('couponAmount', String(couponAmount))
            sessionStorage.setItem('pointAmount', String(points))
            sessionStorage.setItem('selectedCouponId', selectedCouponId ? String(selectedCouponId) : '')

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

    useEffect(() => {
        if (orderItems.length === 0) return
            ; (async () => {
                try {
                    // 쿠폰
                    const { data } = await requester.get('/api/coupon')
                    const fetched: AvailableCoupon[] = data?.items ?? []
                    console.log(fetched);
                    setCoupons(fetched)

                    // “가장 할인 큰 쿠폰” 자동 선택
                    if (fetched.length > 0) {
                        let bestId: number | null = null
                        let bestDiscount = -1
                        for (const c of fetched) {
                            const target = orderItems
                                .filter(i => i.productId === c.productId)
                                .reduce((s, i) => s + i.price * i.quantity, 0)
                            const disc = Math.floor(target * (c.salePercent / 100))
                            if (disc > bestDiscount) {
                                bestDiscount = disc
                                bestId = c.couponId
                            }
                        }
                        setSelectedCouponId(bestId)
                    } else {
                        setSelectedCouponId(null)
                    }

                    // 포인트
                    const { data: pData } = await requester.get('/api/points')
                    setAvailablePoints(Number(pData?.availablePoints ?? 0))
                } catch (e) {
                    console.error('쿠폰/포인트 로드 실패', e)
                }
            })()
    }, [orderItems])

    // ✅ 포인트 사용량 캡 (서버 값/합계 변경될 때 보정)
    useEffect(() => {
        const cap = Math.min(totalBeforePoints, availablePoints)
        if (points > cap) setPoints(cap)
    }, [totalBeforePoints, availablePoints, points])

    // ----- fetch default address -----
    useEffect(() => {
        (async () => {
            try {
                const res = await requester.get('/api/addresses');
                const addresses: AddressDto[] = res.data;
                const def = addresses.find(a => a.isDefault);
                if (def) {
                    const zip =
                        (def as AddressDto & { postalCode?: string; postCode?: string; zipcode?: string; zipCode?: string; zonecode?: string }).postalCode ??
                        (def as AddressDto & { postalCode?: string; postCode?: string; zipcode?: string; zipCode?: string; zonecode?: string }).postCode ??
                        (def as AddressDto & { postalCode?: string; postCode?: string; zipcode?: string; zipCode?: string; zonecode?: string }).zipcode ??
                        (def as AddressDto & { postalCode?: string; postCode?: string; zipcode?: string; zipCode?: string; zonecode?: string }).zipCode ??
                        (def as AddressDto & { postalCode?: string; postCode?: string; zipcode?: string; zipCode?: string; zonecode?: string }).zonecode ?? '';

                    const addr = {
                        id: def.id,
                        name: def.name,
                        phone: def.phone ?? '',
                        fullAddress: formatFullAddress(def),    // ✅ [우편번호] + 주소
                        request: def.message ?? '',
                        postalCode: zip || undefined,
                    };
                    setSelectedAddress(addr);
                    sessionStorage.setItem('selectedAddress', JSON.stringify(addr));
                }
            } catch (err) {
                console.error('주소 불러오기 실패', err);
            }
        })();
    }, []);

    return (
        <main className={styles.checkout_container}>
            <AddressBox
                selectedAddress={selectedAddress ?? null}
                onOpenModal={() => setIsAddressModalOpen(true)}
                onOpenRequestModal={() => setReqOpen(true)}
                onChangeRequest={(req) => {
                    if (!selectedAddress) return
                    setSelectedAddress({ ...selectedAddress, request: req }) // zustand 업데이트
                }}
            />

            {/* 주문 요약 카드: 여러 상품 렌더링하는 버전 사용 */}
            <OrderSummaryCard
                orderItems={orderItems}
                deliveryType={deliveryType}
                onChangeDelivery={(t) => {
                    setDeliveryType(t)
                    setDeliveryFee(t === 'FAST' ? 5000 : 0)
                }}
                totalPrice={totalPrice}
                coupons={coupons}                        // 서버에서 받아온 전체/보유 쿠폰
                selectedCouponId={selectedCouponId}      // 선택된 쿠폰 id
                onSelectCoupon={setSelectedCouponId}     // 선택 핸들러
                couponAmount={couponAmount}              // 부모에서 계산하면 전달(선택)
            />

            <PointSection
                availablePoints={availablePoints}
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
                    selectedAddress={selectedAddress ? {
                        ...selectedAddress,
                        request: selectedAddress.request
                    } : null}
                    onChangeSelected={(a) => {
                        const zip =
                            (a as unknown as AddressDtoWithPostalFields).postalCode ??
                            (a as unknown as AddressDtoWithPostalFields).postCode ??
                            (a as unknown as AddressDtoWithPostalFields).zipcode ??
                            (a as unknown as AddressDtoWithPostalFields).zipCode ??
                            (a as unknown as AddressDtoWithPostalFields).zonecode ?? '';

                        if (!a?.id) return; // Early return if no valid address

                        const mapped = {
                            id: a.id,
                            name: a.name ?? '',
                            phone: a.phone ?? '',
                            fullAddress: a.fullAddress ?? '',
                            request: a.request ?? '',
                            postalCode: zip || undefined,
                        };
                        setSelectedAddress(mapped);
                        sessionStorage.setItem('selectedAddress', JSON.stringify(mapped));
                    }}
                />
            )}

            <RequestModal
                open={isReqOpen}
                value={selectedAddress?.request ?? ''}
                onClose={() => setReqOpen(false)}
                onApply={(next) => {
                    if (!selectedAddress) return;
                    const updated = { ...selectedAddress, request: next };
                    setSelectedAddress(updated);
                    sessionStorage.setItem('selectedAddress', JSON.stringify(updated));
                }}
            />
        </main>
    )
}
