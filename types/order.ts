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