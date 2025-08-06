import { create } from 'zustand'

interface Address {
    id: number
    name: string
    phone: string
    fullAddress: string
    request: string
}

interface AddressStore {
    selectedAddress: Address | null
    setSelectedAddress: (address: Address) => void
    clearAddress: () => void
}

export const useAddressStore = create<AddressStore>((set) => ({
    selectedAddress: null,

    setSelectedAddress: (address) => {
        set({ selectedAddress: address })
    },

    clearAddress: () => {
        set({ selectedAddress: null })
    },
}))
