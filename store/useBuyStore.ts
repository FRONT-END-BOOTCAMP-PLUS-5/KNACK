import { create } from 'zustand'

type BuyMode = 'buyNow' | 'fromCart'

type BuyItem = {
    productId: number
    title: string
    price: number
    quantity: number
    imageUrl?: string
}

interface BuyState {
    selectedItems: BuyItem[]
    mode: BuyMode | null
    setBuyNow: (item: BuyItem) => void
    setFromCart: (items: BuyItem[]) => void
    clearBuyState: () => void
}

export const useBuyStore = create<BuyState>((set) => ({
    selectedItems: [],
    mode: null,

    setBuyNow: (item) =>
        set({
            selectedItems: [item],
            mode: 'buyNow',
        }),

    setFromCart: (items) =>
        set({
            selectedItems: items,
            mode: 'fromCart',
        }),

    clearBuyState: () =>
        set({
            selectedItems: [],
            mode: null,
        }),
}))
