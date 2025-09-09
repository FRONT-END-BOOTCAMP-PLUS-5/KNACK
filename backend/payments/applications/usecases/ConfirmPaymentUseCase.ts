import { PaymentRepository } from '@/backend/payments/domains/repositories/PaymentRepository';
import { CouponRepository } from '@/backend/coupon/domains/repositories/CouponRepository';
import { TossGateway } from '@/types/payment';
import prisma from '@/backend/utils/prisma';

export class ConfirmPaymentUseCase {
  constructor(
    private readonly payments: PaymentRepository,
    private readonly coupons: CouponRepository,
    private readonly toss: TossGateway
  ) {}

  async execute(args: {
    userId: string;
    tossPaymentKey: string;
    amount: number;
    selectedCouponId?: number | null;
    pointsToUse?: number | null;
  }) {
    const { userId, tossPaymentKey, amount, selectedCouponId } = args;

    // 1) tossPaymentKey로 선점 (동시 처리 차단 + 멱등)

    // 2) 토스 결제 승인 (트랜잭션 바깥)
    const confirm = await this.toss.confirmPayment({ tossPaymentKey, amount });

    // 3) 트랜잭션으로 원자 처리
    const paid = await prisma.$transaction(async (tx) => {
      // 상태 전이: CONFIRMING -> PAID (경합 시 false)
      const ok = await this.payments.markPaid({
        id: 0,
        method: confirm.method,
        approvedAt: new Date(confirm.approvedAt ?? Date.now()),
        requestedAt: confirm.requestedAt ? new Date(confirm.requestedAt) : undefined,
        tossPaymentKey,
      });
      if (!ok) {
        // 뒤늦은 요청 → 이미 처리된 결과 멱등 반환
        const already = await this.payments.findByTossPaymentKey(tossPaymentKey);
        return already!;
      }

      // ✅ 쿠폰 차감: 트랜잭션 클라이언트(tx) 전달
      if (selectedCouponId) {
        await this.coupons.consumeByDelete(userId, Number(selectedCouponId), tx);
      }

      // 갱신된 레코드 반환 (id 포함)
      const refreshed = await this.payments.findByTossPaymentKey(tossPaymentKey);
      return refreshed!;
    });

    // ✅ 항상 payment 테이블 id 포함해 반환
    return {
      id: paid.id, // ✅ payment.id
      status: 'DONE',
      paymentNumber: paid.paymentNumber?.toString() ?? null,
      approvedAt: paid.approvedAt?.toISOString() ?? null,
      method: paid.method ?? null,
    };
  }
}
