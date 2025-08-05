// 📁 backend/infrastructure/db/PrismaCardRepository.ts
import { PrismaClient } from '@prisma/client'
import { CardRepository } from '@/backend/payments/domains/repositories/CardRepository'
import { CreateCardDto } from '@/backend/payments/applications/dtos/CreateCardDto'

const prisma = new PrismaClient()

export class KnackCardRepository implements CardRepository {
    async save(card: CreateCardDto): Promise<void> {
        // await prisma.card.create({
        //     data: {
        //         paymentId: card.paymentId,
        //         issuerCode: card.issuerCode,
        //         acquirerCode: card.acquirerCode,
        //         number: card.number,
        //         installmentPlanMonths: card.installmentPlanMonths,
        //         approveNo: card.approveNo,
        //         useCardPoint: card.useCardPoint,
        //         isInterestFree: card.isInterestFree,
        //     }
        // })
    }

    async findByPaymentId(paymentId: number): Promise<CreateCardDto | null> {
        // const data = await prisma.card.findUnique({ where: { paymentId } })
        // if (!data) return null

        // return {
        //     paymentId: data.paymentId,
        //     issuerCode: data.issuerCode,
        //     acquirerCode: data.acquirerCode,
        //     number: data.number,
        //     installmentPlanMonths: data.installmentPlanMonths,
        //     approveNo: data.approveNo,
        //     useCardPoint: data.useCardPoint,
        //     isInterestFree: data.isInterestFree
        // }
        return null;
    }
}
