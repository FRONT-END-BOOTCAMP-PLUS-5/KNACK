export interface AddressDto {
    id: number
    userId: string
    name: string
    phone: string | null
    zipCode: string
    detail: string | null
    main: string
    message: string | null
    isDefault: boolean
}