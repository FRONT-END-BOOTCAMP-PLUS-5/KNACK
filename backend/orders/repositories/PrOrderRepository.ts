import { OrderRepository } from '@/backend/orders/domains/repositories/OrderRepository';
import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto';
import prisma from '@/backend/utils/prisma';
import { OrderDto } from '../applications/dtos/GetOrderDto';
import { mapOrderRowToDto } from '@/utils/orders';
import { RepoIndependentOrder } from '@/types/order';

export class PrOrderRepository implements OrderRepository {
  async saveMany(orders: CreateOrderEntityDto[]): Promise<number[]> {
    const created = await prisma.$transaction(
      orders.map((o) =>
        prisma.order.create({
          data: {
            userId: o.userId,
            productId: o.productId,
            count: o.count,
            price: o.price,
            salePrice: o.salePrice,
            deliveryStatus: o.deliveryStatus,
            createdAt: o.createdAt,
            paymentId: null,
            optionValueId: o.optionValueId,
          },
        })
      )
    );
    return created.map((o) => o.id);
  }

  async updatePaymentId(orderIds: number[], paymentId: number): Promise<void> {
    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { paymentId },
    });
  }

  async updateDeliveryStatus(orderId: number, deliveryStatus: number): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { deliveryStatus },
    });
  }

  async findManyByIdsAndUserId(orderIds: number[], userId: string): Promise<number[]> {
    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
        userId,
      },
      select: {
        id: true,
      },
    });

    return orders.map((order) => order.id);
  }

  async findById(id: number, userId: string): Promise<OrderDto | null> {
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        product: true,
        payment: {
          include: {
            address: true,
          },
        },
      },
    });
    if (!order) return null;

    const dto = mapOrderRowToDto(order);
    return dto;
  }

  async findByIdWithAddress(id: number, userId: string): Promise<RepoIndependentOrder | null> {
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        product: true,
        payment: {
          include: {
            address: true,
          },
        },
      },
    });
    if (!order) return null;

    return order as RepoIndependentOrder;
  }

  async linkOrdersToPayment(args: { orderIds: number[]; paymentId: number; userId: string }): Promise<number> {
    const result = await prisma.order.updateMany({
      where: {
        id: { in: args.orderIds },
        userId: args.userId,
        paymentId: null, // Only link orders that aren't already linked
      },
      data: { paymentId: args.paymentId },
    });
    return result.count;
  }
}
