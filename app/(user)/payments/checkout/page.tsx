'use client'

import { useEffect } from 'react'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import styles from './CheckoutPage.module.scss'
import AddressBox from '@/components/Address/AddressBox'
import { useAddressStore } from '@/store/useAddressStore'
import requester from '@/utils/requester'
import PaymentFooter from '@/components/Payments/PaymentFooter/PaymentFooter'
import OrderSummaryCard from '@/components/Payments/Order/OrderSummaryCard'
import { useOrderStore } from '@/store/useOrderStore'
import { AddressDto } from '@/backend/address/applications/dtos/AddressDto'
import PointSection from '@/components/Payments/Points/PointSection'
import FinalOrderSummary from '@/components/Payments/Order/FInalOrderSummary'
import { IProduct } from '@/types/product'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!

export default function CheckoutPage() {
    const {
        getTotalPrice,
        getTotalPriceWithoutDelivery,
        orderItems,
        setOrderItems,
        setDeliveryType,
        deliveryFee,
        points,
    } = useOrderStore()

    const { selectedAddress, setSelectedAddress } = useAddressStore()

    const totalPrice = getTotalPrice()
    const priceWithoutDelivery = getTotalPriceWithoutDelivery()

    // ✅ 최초 진입 시 mock 데이터 저장
    useEffect(() => {
        const checkout = [
            { productId: 5, quantity: 1, optionValueId: 5, deliveryMethod: 'normal' }
        ];

        (async () => {
            const res = await requester.get(`/api/products`, { params: { id: checkout[0].productId } })
            const p = res.data.result as IProduct | null
            if (!p) return

            // 응답이 단일 객체이므로, 우리가 원하는 store 형식의 배열을 직접 만든다
            const items = [{
                productId: p.id,
                price: p.price,
                quantity: checkout[0].quantity,
                thumbnail_image: p.thumbnailImage,
                deliveryType: checkout[0].deliveryMethod,
            }]

            setOrderItems(items)                              // 상태 업데이트
            sessionStorage.setItem('orderItems', JSON.stringify(items)) // 방금 만든 로컬 변수 사용
            setDeliveryType('FAST', 5000)
        })()
        // ⚠ 의존성에 orderItems 넣지 말 것 (초기 빈 배열 저장/재실행 문제)
    }, [setOrderItems, setDeliveryType])

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
