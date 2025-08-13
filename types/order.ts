// types/order.ts
import { AddressDto } from "@/backend/address/applications/dtos/AddressDto"

/* ---------- 장바구니/주문 ---------- */
export type CheckoutRow = {
    productId: number
    quantity: number
    optionValueId?: number
    deliveryMethod: 'normal' | 'fast' | string
}

export type OrderItem = {
    productId: number
    price: number
    quantity: number
    thumbnail_image: string
    deliveryType: string
    kor_name?: string
    eng_name?: string
}

export interface RepresentativeProduct {
    id: number;
    korName: string;
    engName: string;
    thumbnailUrl: string;
    name: string;
    price: number;
}

/* ---------- 주소 ---------- */
export type AddressDtoWithPostalFields = AddressDto & {
    postalCode?: string
    postCode?: string
    zipcode?: string
    zipCode?: string
    zonecode?: string
}

export type SelectedAddress = {
    id: number
    name: string
    phone?: string
    fullAddress?: string
    request?: string
} | null

export type ApiAddress = {
    id: number
    name: string
    phone: string
    zipCode: string
    main: string
    detail: string | null
    message: string | null
    isDefault?: boolean
}

export interface AddressAddModalProps {
    onClose: () => void
    onSaved?: (addr: SelectedAddress) => void
    editing?: ApiAddress | null
    /** 신규 등록 시 카카오 검색에서 넘겨줄 초기값 (선택) */
    initial?: Partial<Pick<ApiAddress, 'zipCode' | 'main'>>
}

/* AddressBox props */
export type AddressBoxProps = {
    selectedAddress: SelectedAddress | null
    onOpenModal: () => void
    onOpenRequestModal?: () => void
    onChangeRequest: (request: string) => void
}

/* RequestModal props */
export type RequestModalProps = {
    open: boolean
    value: string
    onClose: () => void
    onApply: (next: string) => void
}

/* AddressModal props */
export type AddressModalProps = {
    onClose: () => void
    selectedAddress: SelectedAddress | null
    onChangeSelected: (addr: SelectedAddress) => void
}

/* ---------- 포인트/결제 요약 ---------- */
export type PointSectionProps = {
    availablePoints: number
    maxUsablePoints: number
    onChange: (value: number) => void
}

export interface PaymentFooterProps {
    totalPrice: number
    onPay: () => void
    disabled?: boolean
}

export interface FinalOrderSummaryProps {
    price: number
    fee?: number
    shippingFee: number
    couponAmount?: number
    pointAmount?: number
}

/* ---------- 쿠폰 (단일 표준) ---------- */
export type Coupon = {
    createdAt: string | number | Date | null | undefined
    id: number
    name: string
    salePercent: number
    productId: number
    expirationAt?: string | null
}

export type CouponSelectModalProps = {
    isOpen: boolean
    onClose: () => void
    coupons: Coupon[]
    orderItems: OrderItem[]
    selectedCouponId: number | null
    onSelectCoupon: (couponId: number | null) => void
}

/* OrderSummaryCard: 로직 외부 계산/제어 */
export type OrderSummaryCardProps = {
    orderItems: OrderItem[]
    deliveryType: 'FAST' | 'STOCK'
    onChangeDelivery: (t: 'FAST' | 'STOCK') => void

    baseSum: number
    shippingFee: number
    couponDiscount: number
    totalPayable: number

    selectedCouponName?: string | null
    applicableCouponCount: number
    onOpenCouponModal: () => void
    onClearCoupon?: () => void

    onItemMenuClick?: (item: OrderItem) => void
}

/* ---------- 서버 confirm 입력 (서버 영역으로 옮기는 걸 권장) ---------- */
export type CouponInput = {
    userId: string
    tossPaymentKey: string
    orderId: string
    amount: number
    addressId: number
    orderIds: string[]
    method: string
    status: 'DONE' | 'CANCELED'
    approvedAt: Date
    requestedAt: Date
    card?: {
        issuerCode?: string
        acquirerCode?: string
        number?: string
        installmentPlanMonths?: number
        approveNo?: string
        useCardPoint?: boolean
        isInterestFree?: boolean
    }
    selectedCouponId?: number | null
}

/* ---------- (백엔드 전용: 필요 시 위치 이동 권장) ---------- */
export type AdjustPointsResult = { availablePoints: number; delta: number }


