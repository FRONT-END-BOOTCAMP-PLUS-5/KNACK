import { create } from 'zustand'

type DeliveryType = 'FAST' | 'STOCK'

export interface OrderItem {
    productId: number
    price: number
    quantity: number
    thumbnail_image: string
    deliveryType: string
}

interface OrderState {
    orderItems: OrderItem[]
    deliveryFee: number
    points: number
    deliveryType: DeliveryType
    defaultDeliveryFees: Record<DeliveryType, number>

    setOrderItems: (items: OrderItem[]) => void
    setDeliveryFee: (fee: number) => void
    setPoints: (points: number) => void
    setDeliveryType: (type: DeliveryType, overrideFee?: number) => void
    setDefaultDeliveryFee: (type: DeliveryType, fee: number) => void
    clearOrder: () => void
    getTotalPrice: () => number
    getTotalPriceWithoutDelivery: () => number
}


export const useOrderStore = create<OrderState>((set, get) => ({
    orderItems: [],
    deliveryFee: 0,
    points: 0,
    deliveryType: 'FAST',
    defaultDeliveryFees: {
        FAST: 0,
        STOCK: 0,
    },

    setOrderItems: (items) => set({ orderItems: items }),

    setDeliveryFee: (fee) => set({ deliveryFee: fee }),

    setPoints: (points) => set({ points }),

    setDeliveryType: (type, overrideFee) => {
        const defaultFee = get().defaultDeliveryFees[type]
        set({
            deliveryType: type,
            deliveryFee: overrideFee ?? defaultFee,
        })
    },

    setDefaultDeliveryFee: (type, fee) => {
        const prev = get().defaultDeliveryFees
        set({ defaultDeliveryFees: { ...prev, [type]: fee } })
    },

    clearOrder: () =>
        set({
            orderItems: [],
            deliveryFee: get().defaultDeliveryFees['FAST'],
            deliveryType: 'FAST',
            points: 0,
        }),

    getTotalPrice: () => {
        const itemsTotal = get().orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )
        return itemsTotal + get().deliveryFee
    },

    getTotalPriceWithoutDelivery: () => {
        const itemsTotal = get().orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )
        return itemsTotal
    },
}))


