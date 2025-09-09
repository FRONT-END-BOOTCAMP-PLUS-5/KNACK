import { PaymentRepository } from '../../domains/repositories/PaymentRepository';
import { GetOrderbyPaymentsDto } from '../dtos/GetOrderbyPaymentsDto';
import { normalizeStatus } from '@/utils/orders';
import type { RepoOrder, RepoOrderItem, RepoPayment } from '@/types/order';

export class GetPaymentsByUserIdUseCase {
  constructor(private repo: PaymentRepository) {}

  // orders 구조 통일
  private extractItems(p: RepoPayment): RepoOrderItem[] {
    const orders = p.orders ?? [];
    if (orders.length === 0) return [];
    // case A: orders[].orderItems[] (중첩 구조)
    if ('orderItems' in orders[0]) {
      return (orders as unknown as RepoOrder[]).flatMap((o) => o.orderItems ?? []);
    }
    // case B: orders[]가 곧 아이템 레벨
    return orders as unknown as RepoOrderItem[];
  }

  private mapToOrderItemDto(payment: RepoPayment, item: RepoOrderItem) {
    return {
      id: item.id,
      userId: payment.userId,
      productId: item.productId,
      price: Number(item.price ?? 0),
      salePrice: Number(item.salePrice ?? item.price ?? 0),
      tracking: item.tracking ?? null,
      createdAt: item.createdAt ?? payment.createdAt ?? new Date(),
      // 배송 상태: 4 == 완료, 그 외 진행중
      deliveryStatus: item.deliveryStatus ?? 1,
      count: item.quantity ?? item.count ?? 1,
      optionValueId: item.optionValueId ?? 0,
      couponPrice: item.couponPrice ?? 0,
      point: item.point ?? 0,
      product: {
        id: item.product?.id ?? item.productId,
        korName: item.product?.korName ?? '',
        engName: item.product?.engName ?? '',
        thumbnailImage: item.product?.thumbnailImage ?? '',
      },
      optionValue: {
        id: item.optionValue?.id ?? 0,
        name: item.optionValue?.name ?? '',
        value: item.optionValue?.value ?? '',
      },
    };
  }

  private mapToDto(payment: RepoPayment): GetOrderbyPaymentsDto & {
    // 하위 호환: orders 그대로 유지
    orders: ReturnType<GetPaymentsByUserIdUseCase['mapToOrderItemDto']>[];
    // 추가: 상태 분류 및 카운트
    ordersInProgress: ReturnType<GetPaymentsByUserIdUseCase['mapToOrderItemDto']>[];
    ordersCompleted: ReturnType<GetPaymentsByUserIdUseCase['mapToOrderItemDto']>[];
    ordersSummary: { total: number; inProgress: number; completed: number };
  } {
    const items = this.extractItems(payment).map((it) => this.mapToOrderItemDto(payment, it));
    const ordersCompleted = items.filter((o) => o.deliveryStatus === 4);
    const ordersInProgress = items.filter((o) => o.deliveryStatus !== 4);

    return {
      id: payment.id,
      createdAt: payment.createdAt ?? new Date(),
      address: payment.address ?? null,
      paymentNumber: payment.paymentNumber,
      tossPaymentKey: payment.tossPaymentKey ?? null,
      price: Number(payment.price ?? 0),
      approvedAt: payment.approvedAt ?? new Date(),
      method: payment.method ?? '',
      status: normalizeStatus(payment.status) || 'FAILED',
      userId: payment.userId,

      // 원래 필드 유지
      orders: items,

      // 추가 필드: 상태 분류/요약
      ordersInProgress,
      ordersCompleted,
      ordersSummary: {
        total: items.length,
        inProgress: ordersInProgress.length,
        completed: ordersCompleted.length,
      },
    };
  }

  // async execute(userId: string) {
  //     const payments = await this.repo.findWithOrderItemsByUserId(userId)
  //     const dtos = payments.map(p => this.mapToDto(p))

  //     // (선택) 전체 결제 기준의 전역 요약도 제공
  //     const allOrders = dtos.flatMap(p => p.orders)
  //     const allCompleted = allOrders.filter(o => o.deliveryStatus === 4)
  //     const allInProgress = allOrders.filter(o => o.deliveryStatus !== 4)
  //     const overallSummary = {
  //         total: allOrders,
  //         inProgress: allInProgress,
  //         completed: allCompleted,
  //     }

  //     // 필요에 따라 { payments: dtos }만 반환해도 됨
  //     return { payments: dtos, overallSummary }
  // }
}
