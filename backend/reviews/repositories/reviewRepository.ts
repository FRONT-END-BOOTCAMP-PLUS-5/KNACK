import { Review } from '../domains/entities/Review';
import { Order } from '../domains/entities/Order';
import prisma from '../../utils/prisma';

// 리뷰 리포지토리 인터페이스
export interface ReviewRepository {
  findReviewsByUserId(userId: string): Promise<Review[]>;
  findReviewByUserAndProduct(userId: string, productId: number): Promise<Review | null>;
  findReviewByOrderId(orderId: number): Promise<Review | null>; // orderId로 리뷰 찾기 추가
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
        orderId: review.orderId, // orderId 추가
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
      const review = await prisma.review.findUnique({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      });
      
      if (!review) return null;
      
      return {
        userId: review.userId,
        productId: review.productId,
        orderId: review.orderId, // orderId 추가
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
        orderId: review.orderId, // orderId 추가
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
      console.log('🔍 리뷰 생성 시도:', review); // 디버깅 로그 추가
      
      const createdReview = await prisma.review.create({
        data: {
          userId: review.userId,
          productId: review.productId,
          contents: review.contents,
          rating: review.rating,
          reviewImages: review.reviewImages,
          orderId: review.orderId // orderId 필수 필드로 변경
        }
      });
      
      console.log('✅ 리뷰 생성 성공:', createdReview); // 성공 로그 추가
      
      return {
        userId: createdReview.userId,
        productId: createdReview.productId,
        orderId: createdReview.orderId, // orderId 추가
        contents: createdReview.contents,
        rating: createdReview.rating || 0,
        reviewImages: createdReview.reviewImages || undefined,
        createdAt: createdReview.createdAt || new Date()
      };
    } catch (error) {
      console.error('❌ 리뷰 생성 실패 - 상세 오류:', error); // 상세 오류 로그
      console.error('❌ 오류 타입:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ 오류 메시지:', error instanceof Error ? error.message : 'Unknown error');
      console.error('❌ 오류 스택:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Prisma 오류인 경우 상세 정보 출력
      if (error && typeof error === 'object' && 'code' in error) {
        console.error('❌ Prisma 오류 코드:', (error as any).code);
        console.error('❌ Prisma 오류 메타:', (error as any).meta);
      }
      
      throw new Error('리뷰를 생성할 수 없습니다.');
    }
  }
}

// Prisma를 사용한 주문 리포지토리 구현
export class PrismaOrderRepository implements OrderRepository {
  // 사이즈 정보 추출 헬퍼 함수 - 이제 사용하지 않음
  // private extractSizeFromProduct(product: any): string {
  //   try {
  //     if (!product.productOptionMappings || product.productOptionMappings.length === 0) {
  //       return '사이즈 정보 없음';
  //     }

  //     // 첫 번째 옵션 타입에서 사이즈 정보 찾기
  //     const optionMapping = product.productOptionMappings[0];
  //     if (optionMapping?.optionType?.optionValue && optionMapping.optionType.optionValue.length > 0) {
  //       // 사이즈 관련 옵션 값들 (예: S, M, L, 250, 265 등)
  //       const sizeValues = optionMapping.optionType.optionValue;
  //       return sizeValues[0].name; // 첫 번째 옵션 값 반환
  //     }

  //     return '사이즈 정보 없음';
  //   } catch (error) {
  //     console.error('사이즈 정보 추출 실패:', error);
  //     return '사이즈 정보 없음';
  //   }
  // }

  async findOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      console.log('🔍 Prisma 쿼리 시작 - userId:', userId);
      
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
              // productOptionMappings 제거 - 더 이상 필요하지 않음
            },
          },
          optionValue: true, // optionValue 정보 포함
        },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log('✅ Prisma 쿼리 성공 - 주문 개수:', orders.length);
      
      // 첫 번째 주문의 Product 정보 로그
      if (orders.length > 0 && orders[0].product) {
        console.log('🔍 첫 번째 주문의 Product 정보:', {
          id: orders[0].product.id,
          thumbnailImage: orders[0].product.thumbnailImage,
          engName: orders[0].product.engName,
          korName: orders[0].product.korName,
          category: orders[0].product.category,
          optionValue: orders[0].optionValue, // optionValue 정보 추가
        });
        
        // optionValue 정보 디버깅 로그 추가
        if (orders[0].optionValue) {
          console.log('🔍 OptionValue 정보:', {
            id: orders[0].optionValue.id,
            name: orders[0].optionValue.name,
            typeId: orders[0].optionValue.typeId // any 타입 제거
          });
        } else {
          console.log('❌ OptionValue 정보가 없음');
        }
      }
      
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
        optionValue: order.optionValue ? {  // optionValue 정보 추가
          id: order.optionValue.id,
          name: order.optionValue.name,
          typeId: order.optionValue.typeId
        } : undefined
      }));
    } catch (error) {
      console.error('❌ 주문 조회 실패:', error);
      console.error('❌ 오류 상세:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
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
              // productOptionMappings 제거
            },
          },
          optionValue: true, // optionValue 정보 포함
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
        optionValue: order.optionValue ? {  // optionValue 정보 추가
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
