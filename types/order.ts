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

export type AvailableCoupon = {
    mappingId: number
    couponId: number
    name: string
    salePercent: number
    productId: number
    expirationAt?: string | null
}
