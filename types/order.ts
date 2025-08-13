import { AddressDto } from "@/backend/address/applications/dtos/AddressDto"

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

export type AddressDtoWithPostalFields = AddressDto & {
    postalCode?: string;
    postCode?: string;
    zipcode?: string;
    zipCode?: string;
    zonecode?: string;
};

export type SelectedAddress = {
    id: number
    name: string
    phone?: string
    fullAddress?: string
    request?: string
} | null

export type PointSectionProps = {
    availablePoints: number
    maxUsablePoints: number
    onChange: (value: number) => void
}

export type Props = {
    orderItems: OrderItem[]
    deliveryType: 'FAST' | 'STOCK'
    onChangeDelivery: (type: 'FAST' | 'STOCK') => void
    totalPrice: number
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

export interface AddressAddModalProps {
    onClose: () => void
    onSaved?: (addr: SelectedAddress) => void
    editing?: ApiAddress | null
    /** 신규 등록 시 카카오 검색에서 넘겨줄 초기값 (선택) */
    initial?: Partial<Pick<ApiAddress, 'zipCode' | 'main'>>
}

export type addressProps = {
    selectedAddress: SelectedAddress | null
    onOpenModal: () => void
    onOpenRequestModal?: () => void;
    onChangeRequest: (request: string) => void
}

export type ApiAddress = {
    id: number; name: string; phone: string;
    zipCode: string; main: string; detail: string | null;
    message: string | null; isDefault?: boolean
}

export interface AddressModalProps {
    onClose: () => void
    selectedAddress: SelectedAddress | null
    onChangeSelected: (addr: SelectedAddress) => void
    onOpenCreate?: (initial?: Partial<ApiAddress>) => void
}

export type requestProps = {
    open: boolean;
    value: string;                          // 현재 저장된 요청사항 (빈 문자열이면 ‘없음’)
    onClose: () => void;
    onApply: (next: string) => void;        // 최종 선택(빈 문자열 = 없음)
};

export type RepresentativeProduct = {
    productId: number | null
    name: string
    thumbnailUrl: string | null
    unitPrice: number
    quantity: number
    lineTotal: number
}

export type AdjustPointsResult = { availablePoints: number; delta: number }

export type CouponLite = {
    couponId: number
    name: string
    salePercent: number
    productId: number
    expirationAt?: string | null
}

export type PropsWithCoupon = Props & {
    coupons?: Coupon[]              // 사용 가능한 쿠폰 목록
    selectedCouponId?: number | null    // 현재 선택된 쿠폰
    onSelectCoupon?: (id: number | null) => void
    couponAmount?: number               // 부모에서 계산한 할인금액(있으면 표시)
}

export type Coupon = {
    id: number; name: string; salePercent: number; productId: number; createdAt: string; expirationAt?: string
}
export type CouponSelectModalProps = {
    id: number
    isOpen: boolean
    onClose: () => void
    coupons: Coupon[]
    orderItems: OrderItem[]
    selectedCouponId: number | null
    onSelectCoupon: (couponId: number | null) => void
}

export type OrderSummaryCardProps = {
    // 데이터
    orderItems: OrderItem[]

    // 배송
    deliveryType: 'FAST' | 'STOCK'
    onChangeDelivery: (t: 'FAST' | 'STOCK') => void

    // 금액(모두 부모에서 계산해서 내려줌)
    baseSum: number            // 쿠폰 적용 전 상품 총액
    shippingFee: number        // 배송비
    couponDiscount: number     // 쿠폰 할인액
    totalPayable: number       // 최종 결제금액

    // 쿠폰 표시/행동 (모달은 바깥에서 관리)
    selectedCouponName?: string | null
    applicableCouponCount: number
    onOpenCouponModal: () => void
    onClearCoupon?: () => void  // 선택 쿠폰 해제 (선택)

    // (선택) 기타 UI 행동들
    onItemMenuClick?: (item: OrderItem) => void
}
