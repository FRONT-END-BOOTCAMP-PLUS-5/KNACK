import { CreateCardDto } from "../../applications/dtos/CreateCardDto"

export interface CardRepository {
    save(card: CreateCardDto): Promise<void>
    findByPaymentId(paymentId: number): Promise<CreateCardDto | null>
}
