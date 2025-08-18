export type PaymentStatus = 'PENDING' | 'CONFIRMING' | 'PAID' | 'FAILED' // Local 상태

export interface PaymentRecord {
    id: number
    userId: string
    addressId: number
    amount: number
    status: PaymentStatus
    tossPaymentKey: string | null
    paymentNumber: bigint | null
    approvedAt?: Date | null
    method?: string | null
    createdAt?: Date | null
}

export interface TossConfirmResult {
    paymentKey: string
    method: string
    status: 'DONE' | 'CANCELED' // Toss 상태
    approvedAt?: string
    requestedAt?: string
    amount: number
    card?: {
        issuerCode?: string
        acquirerCode?: string
        number?: string
        installmentPlanMonths?: number
        approveNo?: string
        useCardPoint?: boolean
        isInterestFree?: boolean
    }
}

export interface TossGateway {
    confirmPayment(args: {
        tossPaymentKey: string
        orderId: string
        amount: number
    }): Promise<TossConfirmResult>
}
