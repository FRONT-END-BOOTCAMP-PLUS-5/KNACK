// backend/payments/applications/usecases/GetOrderInPaymentsUseCase.ts
import { PaymentRepository } from '../../domains/repositories/PaymentRepository';
import { GetOrderbyPaymentsDto } from '../dtos/GetOrderbyPaymentsDto';
import { normalizeStatus } from '@/utils/orders';
import type { RepoOrder, RepoOrderItem, RepoPayment } from '@/types/order';

export class GetOrderInPaymentsUseCase {
  constructor(private repo: PaymentRepository) {}

  // orders 구조를 통일
  private extractItems(p: RepoPayment): RepoOrderItem[] {
    const orders = p.orders ?? [];
    if (orders.length === 0) return [];

    // case A: orders[].orderItems[] (중첩 구조)
    if ('orderItems' in orders[0]) {
      return (orders as unknown as RepoOrder[]).flatMap((o) => o.orderItems ?? []);
    }

    // case B: orders[]가 곧 아이템 레벨 (지금 콘솔 출력 형태)
    return orders as unknown as RepoOrderItem[];
  }

  private mapToDto(p: RepoPayment): GetOrderbyPaymentsDto {
    const items = this.extractItems(p);
    return {
      id: p.id,
      createdAt: p.createdAt ?? new Date(),
      address: p.address ?? null,
      paymentNumber: p.paymentNumber, // BigInt 유지
      tossPaymentKey: p.tossPaymentKey ?? '',
      price: Number(p.price ?? 0),
      approvedAt: p.approvedAt ?? new Date(),
      method: p.method ?? '',
      status: normalizeStatus(p.status) || 'FAILED',
      userId: p.userId,
      orders: items.map((item: RepoOrderItem) => ({
        id: item.id,
        userId: p.userId,
        productId: item.productId,
        price: Number(item.price ?? 0),
        salePrice: Number(item.salePrice ?? item.price ?? 0),
        tracking: item.tracking ?? null,
        createdAt: item.createdAt ?? p.createdAt ?? new Date(),
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
      })),
    };
  }
}
