export interface AddressDto {
    id: number
    userId: string
    name: string
    phone: string | null
    detail: string | null
    address: {
        zipCode: string
        main: string
    }
    message: string | null
    isDefault: boolean
}