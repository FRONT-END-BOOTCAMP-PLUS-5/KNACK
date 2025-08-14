// backend/points/applications/usecases/DebitPointsUseCase.ts
import { DebitPointsCommand, AdjustPointsResult } from '@/backend/points/applications/dtos/PointsDto';
import { UserPointsRepository } from '@/backend/points/domains/repositories/UserPointsRepository';

export class DebitPointsUseCase {
    constructor(private readonly repo: UserPointsRepository) { }

    async execute(cmd: DebitPointsCommand): Promise<AdjustPointsResult> {
        if (!(cmd.amount > 0)) {
            throw new Error('amount_must_be_positive');
        }

        // 레포에서 잔액부족 시 'insufficient_points' 같은 메시지를 throw 하도록 구현되어 있다고 가정
        return this.repo.debit({
            userId: cmd.userId,
            amount: cmd.amount,
            reason: cmd.reason ?? 'ORDER_SPEND',
            idempotencyKey: cmd.idempotencyKey,
            metadata: cmd.metadata,
        });
    }
}
