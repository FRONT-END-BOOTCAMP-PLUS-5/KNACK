// mapper/prismaToDto.ts
import { Prisma } from "@prisma/client"
import { OrderDto } from "@/backend/orders/applications/dtos/GetOrderDto"
import { OrderItemDto } from "@/backend/orders/applications/dtos/GetOrderItemDto"

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
