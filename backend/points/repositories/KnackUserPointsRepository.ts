// backend/points/infra/repositories/PrismaUserPointsRepository.ts
import prisma from '@/backend/utils/prisma';
import { UserPointsRepository } from '@/backend/points/domains/repositories/UserPointsRepository';

export class KnackUserPointsRepository implements UserPointsRepository {
    async getAvailablePoints(userId: string): Promise<number> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { point: true },
        });
        // points가 Decimal/BigInt일 가능성 고려
        const raw = user?.point;
        const n =
            typeof raw === 'number'
                ? raw
                : raw && typeof raw === 'object' && 'toNumber' in raw && typeof (raw as { toNumber: () => number }).toNumber === 'function'
                    ? (raw as { toNumber: () => number }).toNumber()
                    : Number(raw ?? 0);

        return Number.isFinite(n) ? n : 0;
    }
}
