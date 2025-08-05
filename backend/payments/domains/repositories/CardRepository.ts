import { CreateCardDto } from '@/backend/payments/applications/payments/dtos/CreateCardDto'

export interface CardRepository {
    save(card: CreateCardDto): Promise<void>
    findByPaymentId(paymentId: number): Promise<CreateCardDto | null>
}
