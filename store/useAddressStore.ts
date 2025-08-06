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
    setSelectedAddress: (addr: Address) => void
}

export const useAddressStore = create<AddressStore>((set) => ({
    selectedAddress: null,
    setSelectedAddress: (addr) => set({ selectedAddress: addr }),
}))
