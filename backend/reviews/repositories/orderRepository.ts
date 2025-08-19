import { Order } from '../domains/entities/Order';
import prisma from '../../utils/prisma';

// 주문 리포지토리 인터페이스
export interface OrderRepository {
  findOrdersByUserId(userId: string): Promise<Order[]>;
  findOrderWithProduct(orderId: number): Promise<Order | null>;
}

// Prisma를 사용한 주문 리포지토리 구현
export class PrismaOrderRepository implements OrderRepository {
  async findOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
            },
          },
          optionValue: true,
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return orders.map(order => {

        
        return {
          id: order.id,
          userId: order.userId,
          productId: order.productId,
          price: order.price || 0,
          salePrice: order.salePrice || 0,
          tracking: order.tracking || undefined,
          createdAt: order.createdAt || new Date(),
          deliveryStatus: order.deliveryStatus || 0,
          count: order.count || 0,
          paymentId: order.paymentId || undefined,
          product: order.product ? {
            id: order.product.id,
            thumbnailImage: order.product.thumbnailImage || '',
            engName: order.product.engName || '상품명 없음',
            korName: order.product.korName || '상품명 없음',
            category: order.product.category ? {
              engName: order.product.category.engName || '카테고리 없음',
              korName: order.product.category.korName || '카테고리 없음'
            } : undefined
          } : undefined,
          optionValue: order.optionValue ? {
            id: order.optionValue.id,
            name: order.optionValue.name,
            typeId: order.optionValue.typeId
          } : undefined
        };
      });
    } catch (error) {
      console.error('주문 조회 실패:', error);
      throw new Error('주문을 조회할 수 없습니다.');
    }
  }

  async findOrderWithProduct(orderId: number): Promise<Order | null> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          product: {
            include: {
              category: true, // include로 전체 카테고리 정보 가져오기
            },
          },
          optionValue: true,
        }
      });
      
      if (!order) return null;
      
      return {
        id: order.id,
        userId: order.userId,
        productId: order.productId,
        price: order.price || 0,
        salePrice: order.salePrice || 0,
        tracking: order.tracking || undefined,
        createdAt: order.createdAt || new Date(),
        deliveryStatus: order.deliveryStatus || 0,
        count: order.count || 0,
        paymentId: order.paymentId || undefined,
        product: order.product ? {
          id: order.product.id,
          thumbnailImage: order.product.thumbnailImage,
          engName: order.product.engName,
          korName: order.product.korName,
          category: order.product.category ? {
            engName: order.product.category.engName || '카테고리 없음',
            korName: order.product.category.korName || '카테고리 없음'
          } : undefined
        } : undefined,
        optionValue: order.optionValue ? {
          id: order.optionValue.id,
          name: order.optionValue.name,
          typeId: order.optionValue.typeId
        } : undefined
      };
    } catch (error) {
      console.error('주문 상품 조회 실패:', error);
      throw new Error('주문 상품을 조회할 수 없습니다.');
    }
  }
}
