export interface CreateAddressDto {
    userId: string
    name: string
    phone?: string
    zipCode: string
    detail?: string
    main: string
    message?: string
    isDefault?: boolean
}