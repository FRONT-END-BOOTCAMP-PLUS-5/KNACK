import { OrderRepository } from '@/backend/orders/domains/repositories/OrderRepository';
import { CreateOrderEntityDto } from '@/backend/orders/applications/dtos/CreateOrderEntityDto';
import prisma from '@/backend/utils/prisma';
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
            paymentId: o.paymentId,
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
            productId: o.productId,
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

  // 주문 상세
  async findById(id: number, userId: string): Promise<RepoIndependentOrder | null> {
    const order = await prisma.order.findFirst({
      where: { id, userId },
      select: {
        id: true,
        createdAt: true,
        korName: true,
        engName: true,
        thumbnailImage: true,
        price: true,
        deliveryStatus: true,
        salePrice: true,
        tracking: true,
        optionName: true,
        optionValue: true,
        productId: true,
        paymentId: true,
        payment: {
          select: {
            id: true,
            deliveryMessage: true,
            detailAddress: true,
            mainAddress: true,
            name: true,
            zipCode: true,
            method: true,
            paymentNumber: true,
            phone: true,
          },
        },
      },
    });

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
        paymentId: true,
        korName: true,
        engName: true,
        thumbnailImage: true,
        optionName: true,
        optionValue: true,
        productId: true,
      },
    });
    return orders;
  }
}
