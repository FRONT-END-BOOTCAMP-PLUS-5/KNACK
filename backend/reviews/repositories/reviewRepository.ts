import { Review } from '../domains/entities/Review';
import { Order } from '../domains/entities/Order';
import prisma from '../../utils/prisma';

// 리뷰 리포지토리 인터페이스
export interface ReviewRepository {
  findReviewsByUserId(userId: string): Promise<Review[]>;
  findReviewByUserAndProduct(userId: string, productId: number): Promise<Review | null>;
  findReviewByOrderId(orderId: number): Promise<Review | null>;
  createReview(review: Omit<Review, 'createdAt'>): Promise<Review>;
}

// 주문 리포지토리 인터페이스
export interface OrderRepository {
  findOrdersByUserId(userId: string): Promise<Order[]>;
  findOrderWithProduct(orderId: number): Promise<Order | null>;
}

// Prisma를 사용한 리뷰 리포지토리 구현
export class PrismaReviewRepository implements ReviewRepository {
  async findReviewsByUserId(userId: string): Promise<Review[]> {
    try {
      const reviews = await prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      
      return reviews.map(review => ({
        userId: review.userId,
        productId: review.productId,
        orderId: review.orderId,
        contents: review.contents,
        rating: review.rating || 0,
        reviewImages: review.reviewImages || undefined,
        createdAt: review.createdAt || new Date()
      }));
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
      throw new Error('리뷰를 조회할 수 없습니다.');
    }
  }

  async findReviewByUserAndProduct(userId: string, productId: number): Promise<Review | null> {
    try {
      const review = await prisma.review.findFirst({
        where: {
          userId,
          productId
        }
      });
      
      if (!review) return null;
      
      return {
        userId: review.userId,
        productId: review.productId,
        orderId: review.orderId,
        contents: review.contents,
        rating: review.rating || 0,
        reviewImages: review.reviewImages || undefined,
        createdAt: review.createdAt || new Date()
      };
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
      throw new Error('리뷰를 조회할 수 없습니다.');
    }
  }

  async findReviewByOrderId(orderId: number): Promise<Review | null> {
    try {
      const review = await prisma.review.findFirst({
        where: { orderId }
      });
      
      if (!review) return null;
      
      return {
        userId: review.userId,
        productId: review.productId,
        orderId: review.orderId,
        contents: review.contents,
        rating: review.rating || 0,
        reviewImages: review.reviewImages || undefined,
        createdAt: review.createdAt || new Date()
      };
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
      throw new Error('리뷰를 조회할 수 없습니다.');
    }
  }

  async createReview(review: Omit<Review, 'createdAt'>): Promise<Review> {
    try {
      const createdReview = await prisma.review.create({
        data: {
          userId: review.userId,
          productId: review.productId,
          contents: review.contents,
          rating: review.rating,
          reviewImages: review.reviewImages,
          orderId: review.orderId
        }
      });
      
      return {
        userId: createdReview.userId,
        productId: createdReview.productId,
        orderId: createdReview.orderId,
        contents: createdReview.contents,
        rating: createdReview.rating || 0,
        reviewImages: createdReview.reviewImages || undefined,
        createdAt: createdReview.createdAt || new Date()
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as any;
        if (prismaError.code === 'P2002') {
          throw new Error('이미 해당 상품에 대한 리뷰를 작성했습니다.');
        }
      }
      
      throw new Error('리뷰를 생성할 수 없습니다.');
    }
  }
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
      
      return orders.map(order => ({
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
      }));
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
              category: true,
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
