// 📁 backend/domain/repositories/PaymentRepository.ts

import { CreatePaymentDto } from "../../applications/dtos/CreatePaymentDto"
import { GetPaymentDto } from "../../applications/dtos/GetPaymentDto"

export interface PaymentRepository {
    findWithOrdersByNumber(paymentNumber: bigint, userId: string): Promise<GetPaymentDto | null>
    findWithOrdersById(paymentId: number, userId: string): Promise<GetPaymentDto | null>
    /**
     * 결제 저장
     */
    save(payment: CreatePaymentDto): Promise<number | null>

    /**
     * Toss 결제 승인 응답에서 받은 고유 TossPaymentKey로 결제 조회
     */
    findByTossPaymentKey(tossPaymentKey: string): Promise<GetPaymentDto | null>

    /**
     * 결제와 연결된 주문들의 paymentId 업데이트
     */
    updateOrderPaymentIds(orderIds: number[], paymentId: number): Promise<void>

    /**
     * Toss Webhook 등을 통해 결제 상태 갱신
     */
    updateStatusByTossPaymentKey(tossPaymentKey: string, status: string): Promise<void>

    generateTodayPaymentNumber(): Promise<number>

    createFailedPayment(params: {
        params: CreatePaymentDto
    }): Promise<void>
}
