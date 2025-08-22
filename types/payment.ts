export type PaymentStatus = 'PENDING' | 'CONFIRMING' | 'PAID' | 'FAILED' // Local 상태

export interface PaymentRecord {
    id: number
    userId: string
    addressId: number
    amount: number
    status: PaymentStatus
    tossPaymentKey: string | null
    paymentNumber: bigint | null
    approvedAt?: Date | null
    method?: string | null
    createdAt?: Date | null
}

export interface TossConfirmResult {
    paymentKey: string
    method: string
    status: 'DONE' | 'CANCELED' // Toss 상태
    approvedAt?: string
    requestedAt?: string
    amount: number
    card?: {
        issuerCode?: string
        acquirerCode?: string
        number?: string
        installmentPlanMonths?: number
        approveNo?: string
        useCardPoint?: boolean
        isInterestFree?: boolean
    }
}

export interface TossGateway {
    confirmPayment(args: {
        tossPaymentKey: string
        orderId: string
        amount: number
    }): Promise<TossConfirmResult>
}

export type Item = {
    id: string;
    orderNumber: string;     // 예: B-SN123376520
    title: string;           // 예: Vans Classic Slip-On Black
    optionText: string;      // 예: 245 / 일반배송
    status?: '대기 중' | '결제 완료' | '취소됨' | string;
    imageUrl: string;
};

export type Totals = {
    subtotal: number;        // 총 구매가
    shippingFee: number;     // 총 배송비
    couponUsed?: number;     // 총 쿠폰 사용 (없으면 표시 "-")
    pointsUsed?: number;     // 총 포인트 사용 (없으면 표시 "-")
    total: number;           // 최초 결제금액(= 최종 결제금액)
};

export type Info = {
    paymentNumber: string;   // 예: O-OR34947640
    transactedAt: Date;      // 거래 일시
    cardMasked: string;      // 예: KB국민카드 ••••••••••700*
};

export type ReceiptItem = {
    id: string;
    orderNumber: string;
    title: string;
    optionText: string;
    status?: string;
    imageUrl: string;
};

export type PaymentData = {
    orders?: unknown[]; // 서버 스키마 다양성 고려
    approvedAt?: string;
    totals?: {
        subtotal?: number;
        shippingFee?: number;
        couponUsed?: number;
        pointsUsed?: number;
        total?: number;
    };
    paymentNumber?: string | number;
    cardMasked?: string;
};