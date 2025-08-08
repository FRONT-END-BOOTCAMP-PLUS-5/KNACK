'use client'

import { useEffect } from 'react'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import styles from './CheckoutPage.module.scss'
import AddressBox from '@/components/Address/AddressBox'
import { useAddressStore } from '@/store/useAddressStore'
import requester from '@/utils/requester'
import PaymentFooter from '@/components/Payments/PaymentFooter/PaymentFooter'
import OrderSummaryCard from '@/components/Payments/Order/OrderSummaryCard'
import { useOrderStore, OrderItem } from '@/store/useOrderStore'
import { AddressDto } from '@/backend/address/applications/dtos/AddressDto'
import PointSection from '@/components/Payments/Points/PointSection'
import FinalOrderSummary from '@/components/Payments/Order/FInalOrderSummary'
import { IProduct } from '@/types/product'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!

export default function CheckoutPage() {
    const {
        getTotalPrice,
        getTotalPriceWithoutDelivery,
        setOrderItems,
        deliveryFee,
        points,
    } = useOrderStore()

    const { selectedAddress, setSelectedAddress } = useAddressStore()

    const totalPrice = getTotalPrice()
    const priceWithoutDelivery = getTotalPriceWithoutDelivery()

    // ✅ 최초 진입 시 mock 데이터 저장
    useEffect(() => {
        const initializeCheckout = async () => {
            try {
                const checkout = [
                    { productId: 5, quantity: 1, optionValueId: 5, deliveryMethod: 'normal' }
                ];

                const ids = checkout.map(c => c.productId)
                const { data } = await requester.post('/api/products', { ids })
                console.log(data.results)
                const results = data.results as (IProduct | null)[]

                const items = results.flatMap((p, i) =>
                    p
                        ? [{
                            productId: p.id,
                            price: p.price,
                            quantity: checkout[i].quantity,
                            thumbnail_image: p.thumbnailImage,
                            deliveryType: checkout[i].deliveryMethod,
                        }]
                        : []
                )

                setOrderItems(items as OrderItem[]) // OrderItem[] 타입이면 맞춰 캐스팅
                sessionStorage.setItem('orderItems', JSON.stringify(items))

                if (data.notFound?.length) {
                    console.warn('not found:', data.notFound)
                    // TODO: 품절/삭제 안내 UI
                }
            } catch (e) {
                console.error('batch fetch failed:', e)
            }
        }
        initializeCheckout()
    }, [setOrderItems])

    useEffect(() => {
        const fetchDefaultAddress = async () => {
            try {
                const res = await requester.get('/api/addresses')
                const addresses: AddressDto[] = res.data

                const defaultAddr = addresses.find(addr => addr.isDefault)
                if (defaultAddr) {
                    sessionStorage.setItem('selectedAddress', JSON.stringify(defaultAddr))
                    setSelectedAddress({
                        id: defaultAddr.id,
                        name: defaultAddr.name,
                        phone: defaultAddr.phone ?? '',
                        fullAddress: `${defaultAddr.main} ${defaultAddr.detail ?? ''}`.trim(),
                        request: defaultAddr.message ?? '',
                    })
                }
            } catch (err) {
                console.error('주소 불러오기 실패', err)
            }
        }

        fetchDefaultAddress()
    }, [setSelectedAddress])

    const handleSaveRequestMessage = async () => {
        const { selectedAddress } = useAddressStore.getState()

        if (!selectedAddress?.id) {
            alert('주소가 선택되지 않았습니다.')
            return
        }

        try {
            const res = await requester.patch(`/api/addresses/${selectedAddress.id}`, {
                message: selectedAddress.request,
            })

            console.log('요청사항 저장 완료:', res.data)
        } catch (error) {
            console.error('요청사항 저장 실패:', error)
            alert('요청사항 저장 중 오류가 발생했습니다.')
        }
    }

    const handlePayment = async () => {
        if (totalPrice === 0) {
            alert('상품을 선택해주세요.')
            return
        }

        if (!selectedAddress) {
            alert('주소지를 선택해주세요.')
            return
        }

        try {
            handleSaveRequestMessage()

            const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)

            await tossPayments.requestPayment('카드', {
                amount: totalPrice,
                orderId: `order_${Date.now()}`,
                orderName: '보드게임 묶음결제',
                customerName: selectedAddress.name || '홍길동',
                successUrl: `${window.location.origin}/payments/success`,
                failUrl: `${window.location.origin}/payments/failure`,
            })
        } catch (e) {
            console.error(e)
            alert('결제 실패')
        }
    }

    const handleUsePoints = (points: number) => {
        // TODO: 포인트 사용 로직 구현
    }

    return (
        <main className={styles.checkout_container}>
            <section className={styles.address_section}>
                <AddressBox />
            </section>

            <OrderSummaryCard />
            <PointSection availablePoints={points} onChange={handleUsePoints} />

            <FinalOrderSummary
                price={priceWithoutDelivery}
                fee={0}
                shippingFee={deliveryFee}
                couponAmount={0}
                pointAmount={points}
            />

            <PaymentFooter totalPrice={totalPrice} onPay={handlePayment} />
        </main>
    )
}
