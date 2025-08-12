import { AdjustPointsResult } from "../../applications/dtos/PointsDto";

export interface UserPointsRepository {
    getAvailablePoints(userId: string): Promise<number>;

    credit(params: {
        userId: string;
        amount: number;
        reason: string;
        idempotencyKey?: string;
        metadata?: Record<string, unknown>;
    }): Promise<AdjustPointsResult>;

    debit(params: {
        userId: string;
        amount: number;
        reason: string;
        idempotencyKey?: string;
        metadata?: Record<string, unknown>;
    }): Promise<AdjustPointsResult>;
}