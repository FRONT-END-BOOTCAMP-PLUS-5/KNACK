// backend/points/applications/usecases/CreditPointsUseCase.ts
import { CreditPointsCommand, AdjustPointsResult } from '@/backend/points/applications/dtos/PointsDto';
import { UserPointsRepository } from '@/backend/points/domains/repositories/UserPointsRepository';

export class CreditPointsUseCase {
    constructor(private readonly repo: UserPointsRepository) { }

    async execute(cmd: CreditPointsCommand): Promise<AdjustPointsResult> {
        if (!(cmd.amount > 0)) {
            throw new Error('amount_must_be_positive');
        }

        return this.repo.credit({
            userId: cmd.userId,
            amount: cmd.amount,
            reason: cmd.reason ?? 'MANUAL',
            idempotencyKey: cmd.idempotencyKey,
            metadata: cmd.metadata,
        });
    }
}
