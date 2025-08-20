import { OrderWithReviewStatus } from '../applications/dtos/ReviewDto';
import prisma from '../../utils/prisma';

export interface OrderRepository {
  findOrdersWithReviewStatus(userId: string): Promise<OrderWithReviewStatus[]>;
}

export class PrismaOrderRepository implements OrderRepository {
  async findOrdersWithReviewStatus(userId: string): Promise<OrderWithReviewStatus[]> {
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        select: {
          id: true,
          userId: true,
          productId: true,
          product: {
            select: {
              id: true,
              thumbnailImage: true,
              engName: true,
              korName: true
            }
          },
          optionValue: {
            select: {
              name: true
            }
          },
          // Review 존재 여부를 한 번에 확인
          review: {
            select: {
              id: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Prisma 결과를 OrderWithReviewStatus 인터페이스에 맞게 변환
      return orders.map(order => ({
        id: order.id,
        userId: order.userId,
        productId: order.productId,
        product: {
          id: order.product.id,
          thumbnailImage: order.product.thumbnailImage,
          engName: order.product.engName,
          korName: order.product.korName
        },
        optionValue: order.optionValue,
        // review는 배열이므로 첫 번째 요소만 사용 (존재 여부 확인용)
        review: order.review.length > 0 ? { id: order.review[0].id } : undefined
      }));
    } catch (error) {
      throw new Error('주문을 조회할 수 없습니다.');
    }
  }
}
