import { OrderRepository } from '@/backend/orders/domains/repositories/OrderRepository';
import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto';
import prisma from '@/backend/utils/prisma';
import { OrderDto } from '../applications/dtos/GetOrderDto';
import { RepoIndependentOrder } from '@/types/order';

export class PrOrderRepository implements OrderRepository {
  // 주문 여러개 저장
  async saveMany(orders: CreateOrderEntityDto[]): Promise<number[]> {
    const created = await prisma.$transaction(
      orders.map((o) =>
        prisma.order.create({
          data: {
            userId: o.userId,
            count: o.count,
            price: o.price,
            salePrice: o.salePrice,
            deliveryStatus: o.deliveryStatus,
            paymentId: null,
            couponPrice: o.couponPrice,
            point: o.point,
            brandName: o.brandName,
            categoryName: o.categoryName,
            colorEngName: o.colorEngName,
            colorKorName: o.colorKorName,
            engName: o.engName,
            korName: o.korName,
            gender: o.gender,
            optionName: o.optionName,
            optionValue: o.optionValue,
            releaseDate: o.releaseDate,
            subCategoryName: o.subCategoryName,
            thumbnailImage: o.thumbnailImage,
          },
        })
      )
    );
    return created.map((o) => o.id);
  }

  // 주문 번호 업데이트
  async updatePaymentId(orderIds: number[], paymentId: number): Promise<void> {
    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { paymentId },
    });
  }

  // 배송 상태 업데이트
  async updateDeliveryStatus(orderId: number, deliveryStatus: number): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { deliveryStatus },
    });
  }

  // ???
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

  // 하나의 주문만 찾기??
  async findById(id: number, userId: string): Promise<OrderDto | null> {
    const order = await prisma.order.findFirst({
      where: { id, userId },
      select: {
        id: true,
        paymentId: true,
        createdAt: true,
        korName: true,
        engName: true,
        thumbnailImage: true,
        price: true,
      },
    });
    if (!order) return null;

    return order;
  }

  // 해당 유저의 모든 주문 찾기
  async findByUserId(userId: string): Promise<RepoIndependentOrder[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        price: true,
        salePrice: true,
        tracking: true,
        createdAt: true,
        deliveryStatus: true,
        count: true,
        paymentId: true,
        korName: true,
        engName: true,
        thumbnailImage: true,
        optionName: true,
        optionValue: true,
      },
    });
    return orders as RepoIndependentOrder[];
  }
}
