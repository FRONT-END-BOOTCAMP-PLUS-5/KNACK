// 📁 backend/infrastructure/db/PrismaPaymentRepository.ts
import prisma from '@/backend/utils/prisma'
import { PaymentRepository } from '@/backend/payments/domains/repositories/PaymentRepository';
import { CreatePaymentDto } from '@/backend/payments/applications/dtos/CreatePaymentDto';
import { GetPaymentDto } from '@/backend/payments/applications/dtos/GetPaymentDto';
import { PaymentRecord, PaymentStatus } from '@/types/payment';
import { graphInclude, RepoPayment } from '@/types/order';

export class PrPaymentRepository implements PaymentRepository {

    async claimByTossKey({ userId, addressId, amount, tossPaymentKey }: {
        userId: string; addressId: number; amount: number; tossPaymentKey: string
    }): Promise<PaymentRecord> {
        // tossPaymentKey UNIQUE로 선점(upsert)
        const row = await prisma.payment.upsert({
            where: { tossPaymentKey },
            create: {
                userId,
                addressId,
                price: amount,
                status: 'CONFIRMING',
                tossPaymentKey,
                paymentNumber: await this.generateTodayPaymentNumber(),
                method: 'CARD',
            },
            update: {}, // 존재 판단만
        })
        return this.toRecord({
            ...row,
            paymentNumber: row.paymentNumber ? Number(row.paymentNumber) : null
        })
    }

    async markPaid({ id, method, approvedAt, requestedAt, tossPaymentKey }: {
        id: number; method: string; approvedAt: Date; requestedAt?: Date | null; tossPaymentKey: string
    }): Promise<boolean> {
        const res = await prisma.payment.updateMany({
            where: { id, status: 'CONFIRMING', tossPaymentKey },
            data: {
                status: 'PAID',
                method,
                approvedAt,
                createdAt: requestedAt ?? new Date(),
            },
        })
        return res.count === 1
    }

    async save(payment: CreatePaymentDto): Promise<number | null> {
        console.log(payment)

        const created = await prisma.payment.create({
            data: {
                userId: payment.userId,
                addressId: payment.addressId,
                price: payment.price,
                createdAt: payment.createdAt ?? new Date(),
                paymentNumber: payment.paymentNumber,
                tossPaymentKey: payment.tossPaymentKey,
                approvedAt: payment.approvedAt ?? new Date(),
                method: payment.method,
                status: payment.status,
                orders: {
                    connect: payment.orderIds.map((id) => ({ id })),
                },
            },
            include: {
                orders: { select: { id: true } },
            },
        })

        return created.id;

    }


    async updateOrderPaymentIds(orderIds: number[], paymentId: number): Promise<void> {
        await prisma.order.updateMany({
            where: { id: { in: orderIds } },
            data: { paymentId },
        });
    }

    async updateStatusByTossPaymentKey(tossPaymentKey: string, status: string): Promise<void> {
        await prisma.payment.update({
            where: { tossPaymentKey }, // 🔧 paymentNumber → TossPaymentKey로 수정
            data: { status },
        });
    }

    async findByTossPaymentKey(tossPaymentKey: string): Promise<GetPaymentDto | null> {
        const data = await prisma.payment.findUnique({
            where: { tossPaymentKey },
            include: {
                orders: { select: { id: true } },
            },
        });

        if (!data) return null;

        return {
            id: data.id,
            userId: data.userId,
            addressId: data.addressId,
            price: data.price ?? 0,
            createdAt: data.createdAt ?? new Date(),
            paymentNumber: data.paymentNumber,
            tossPaymentKey: data.tossPaymentKey ?? '',
            approvedAt: data.approvedAt ?? new Date(),
            method: data.method,
            status: data.status as 'DONE' | 'CANCELED',
            orderIds: data.orders.map(order => order.id),
        }
    }

    async generateTodayPaymentNumber(): Promise<number> {
        const todayPrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '') // 예: '20250806'
        const base = parseInt(todayPrefix) * 1e8 // 예: 2025080600000000

        const latestPayment = await prisma.payment.findFirst({
            where: {
                paymentNumber: {
                    gte: base,
                    lt: base + 99999999, // 오늘 날짜 범위 내
                },
            },
            orderBy: {
                paymentNumber: 'desc',
            },
            select: {
                paymentNumber: true,
            },
        })

        let nextSequence = 1
        if (latestPayment) {
            const latestSeq = Number(latestPayment.paymentNumber) % 1e8
            nextSequence = latestSeq + 1
        }

        const paymentNumber = base + nextSequence
        return paymentNumber
    }

    // ✅ 실패 저장 (paymentKey 없음)
    async createFailedPayment(params: {
        params: CreatePaymentDto
    }): Promise<void> {
        const { userId, addressId, method, price = 0, orderIds = [] } = params.params

        await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    userId,
                    addressId,
                    method,
                    price,
                    status: "FAILED",
                    tossPaymentKey: null,
                    approvedAt: null,
                    paymentNumber: await this.generateTodayPaymentNumber(),
                },
            })

            if (orderIds.length > 0) {
                await tx.order.updateMany({
                    where: { id: { in: orderIds } },
                    data: { paymentId: payment.id },
                })
            }
        })
    }

    async findWithOrdersById(paymentId: number, userId: string): Promise<RepoPayment | null> {
        const data = await prisma.payment.findFirst({
            where: { id: paymentId, userId },
            include: graphInclude,
        })
        return data as unknown as RepoPayment | null
    }

    async findWithOrdersByNumber(paymentNumber: bigint, userId: string): Promise<RepoPayment | null> {
        const data = await prisma.payment.findFirst({
            // ❌ Number(paymentNumber) 금지
            // paymentNumber 컬럼 타입이 BigInt 라면 아래처럼 BigInt 그대로 비교
            where: { paymentNumber, userId },
            include: graphInclude,
        })
        return data as unknown as RepoPayment | null
    }

    // ✅ 새 메서드: 그래프 그대로 반환(축약/매핑 금지)
    async findWithOrderItemsById(paymentId: number, userId: string): Promise<RepoPayment | null> {
        const data = await prisma.payment.findFirst({
            where: { id: paymentId, userId },
            include: graphInclude,
        });
        return data as unknown as RepoPayment | null;
    }

    async findWithOrderItemsByNumber(paymentNumber: bigint, userId: string): Promise<RepoPayment | null> {
        const data = await prisma.payment.findFirst({
            where: { paymentNumber, userId }, // BigInt 그대로
            include: graphInclude,
        });
        return data as unknown as RepoPayment | null;
    }

    private toRecord(row: {
        id: number;
        userId: string;
        addressId: number;
        price: number | null;
        status: string;
        tossPaymentKey: string | null;
        paymentNumber: number | null;
        approvedAt: Date | null;
        method: string;
        createdAt: Date | null;
    }): PaymentRecord {
        return {
            id: row.id,
            userId: row.userId,
            addressId: row.addressId,
            amount: row.price ?? 0,
            status: row.status as PaymentStatus,
            tossPaymentKey: row.tossPaymentKey,
            paymentNumber: row.paymentNumber ? BigInt(row.paymentNumber) : null,
            approvedAt: row.approvedAt,
            method: row.method,
            createdAt: row.createdAt,
        }
    }
}
