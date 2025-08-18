// mapper/prismaToDto.ts
import { Prisma } from "@prisma/client"
import { OrderDto } from "@/backend/orders/applications/dtos/GetOrderDto"
import { OrderItemDto } from "@/backend/orders/applications/dtos/GetOrderItemDto"
import { DtoStatus } from "@/types/order"

type OrderRow = Prisma.OrderGetPayload<{
    include: { product: true; payment: { include: { address: true } } }
}>

export function mapOrderRowToDto(row: OrderRow): OrderDto {
    const items: OrderItemDto[] = [{
        id: row.id,
        productId: row.productId,
        name: row.product?.korName ?? row.product?.engName ?? "",
        thumbnailUrl: row.product?.thumbnailImage ?? null,
        unitPrice: Number(row.salePrice ?? row.price ?? 0),
        count: row.count ?? 0,
    }]

    return {
        id: row.id,
        userId: row.userId,
        paymentId: row.paymentId ?? null,
        addressId: row.payment?.addressId ?? 0,
        createdAt: (row.createdAt ?? new Date()).toISOString(),
        items,
    }
}

export function normalizeStatus(s: string): DtoStatus {
    const u = s.toUpperCase();
    if (u === 'PAID') return 'DONE';
    if (u === 'PENDING') return 'PENDING';
    if (u === 'FAILED') return 'FAILED';
    if (u === 'CANCELED' || u === 'CANCELLED') return 'CANCELED';
    return 'FAILED'; // 알 수 없는 값은 실패로 폴백(또는 throw)
}
