// backend/points/infra/repositories/PrismaUserPointsRepository.ts
import prisma from '@/backend/utils/prisma';
import { UserPointsRepository } from '@/backend/points/domains/repositories/UserPointsRepository';
import { AdjustPointsResult } from '@/types/order';

class InsufficientPointsError extends Error {
    status = 400 as const
    constructor() {
        super('insufficient_points')
        this.name = 'InsufficientPointsError'
    }
}

export class KnackUserPointsRepository implements UserPointsRepository {
    async getAvailablePoints(userId: string): Promise<number> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { point: true }, // ← 스키마가 point(단수)라고 하셨으니 유지
        })
        return this.#num(user?.point)
    }

    /** 포인트 적립 (+) */
    async credit(params: { userId: string; amount: number }): Promise<AdjustPointsResult> {
        const { userId, amount } = params
        if (!(amount > 0)) throw new Error('amount_must_be_positive')

        // 하나의 트랜잭션으로 증가 + 잔액 조회
        const updated = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { point: { increment: amount } },
                select: { id: true }, // RETURN 값은 아래 find로
            })
            const after = await tx.user.findUnique({
                where: { id: userId },
                select: { point: true },
            })
            return after
        })

        const balance = this.#num(updated?.point)
        return { availablePoints: balance, delta: amount }
    }

    /** 포인트 차감 (-) — 원자적 차감: 잔액이 충분한 경우에만 차감됨 */
    async debit(params: { userId: string; amount: number }): Promise<AdjustPointsResult> {
        const { userId, amount } = params
        if (!(amount > 0)) throw new Error('amount_must_be_positive')

        // **원자적 차감**: 조건부 updateMany
        const res = await prisma.user.updateMany({
            where: { id: userId, point: { gte: amount } },
            data: { point: { decrement: amount } },
        })
        if (res.count !== 1) {
            throw new InsufficientPointsError()
        }

        // 차감 후 잔액 조회
        const after = await prisma.user.findUnique({
            where: { id: userId },
            select: { point: true },
        })
        const balance = this.#num(after?.point)
        return { availablePoints: balance, delta: -amount }
    }

    #num(raw: unknown): number {
        if (typeof raw === 'number') return raw
        // Prisma Decimal 지원
        if (raw && typeof raw === 'object' && 'toNumber' in raw) {
            try { return (raw as { toNumber(): number }).toNumber() } catch { /* noop */ }
        }
        const n = Number(raw ?? 0)
        return Number.isFinite(n) ? n : 0
    }
}
