export type PointsDto = {
    availablePoints: number;
};

export type CreditPointsCommand = {
    userId: string;
    amount: number;               // > 0
    reason: string;               // 'ORDER_REWARD' | 'REFUND' | ...
    idempotencyKey?: string;      // 중복 방지 키 (선택)
    metadata?: Record<string, unknown>;
};

export type DebitPointsCommand = {
    userId: string;
    amount: number;               // > 0
    reason: string;               // 'ORDER_SPEND' | ...
    idempotencyKey?: string;
    metadata?: Record<string, unknown>;
};

export type AdjustPointsResult = {
    availablePoints: number;      // 조정 후 잔여 포인트
    delta: number;                // +amount 또는 -amount
};
