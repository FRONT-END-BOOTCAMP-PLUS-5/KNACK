// 📁 backend/domain/repositories/PaymentRepository.ts

import { PaymentRecord } from "@/types/payment"
import { CreatePaymentDto } from "../../applications/dtos/CreatePaymentDto"
import { GetPaymentDto } from "../../applications/dtos/GetPaymentDto"
import { RepoPayment } from "@/types/order"

export interface PaymentRepository {
    findWithOrderItemsByUserId(userId: string): Promise<RepoPayment[]>

    // Add these methods that return RepoPayment with orders
    findWithOrdersByNumber(paymentNumber: bigint, userId: string): Promise<RepoPayment | null>
    findWithOrdersById(paymentId: number, userId: string): Promise<RepoPayment | null>

    findWithOrderItemsByNumber(paymentNumber: bigint, userId: string): Promise<RepoPayment | null>
    findWithOrderItemsById(paymentId: number, userId: string): Promise<RepoPayment | null>

    // 상태 전이: CONFIRMING -> PAID (동시성 방지: where에 status 포함)
    markPaid(args: {
        id: number
        method: string
        approvedAt: Date
        requestedAt?: Date | null
        tossPaymentKey: string
    }): Promise<boolean> // true면 내가 성공, false면 이미 누군가 처리함

    /**  
     *tossPaymentKey로 선점 (있으면 반환, 없으면 CONFIRMING으로 생성)
     */
    claimByTossKey(args: {
        userId: string
        addressId: number
        amount: number
        tossPaymentKey: string
    }): Promise<PaymentRecord>


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
