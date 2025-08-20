import { Review } from '@/backend/reviews/domains/entities/Review';
import { ReviewWithRelations } from '@/backend/reviews/applications/dtos/ReviewDto';
import prisma from '@/backend/utils/prisma';

export interface ReviewRepository {
  findReviewsByUserId(userId: string): Promise<Review[]>;
  findReviewByUserAndProduct(userId: string, productId: number): Promise<Review | null>;
  findReviewByOrderId(orderId: number): Promise<Review | null>;
  createReview(review: Omit<Review, 'id'>): Promise<Review>;
  findReviewsWithRelations(userId: string): Promise<ReviewWithRelations[]>;
}

export class PrReviewRepository implements ReviewRepository {
  async findReviewsByUserId(userId: string): Promise<Review[]> {
    try {
      const reviews = await prisma.review.findMany({
        where: { userId },
        select: {
          userId: true,
          productId: true,
          orderId: true,
          contents: true,
          rating: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return reviews.map(review => ({
        id: 0, // 기본값
        userId: review.userId,
        productId: review.productId,
        orderId: review.orderId,
        contents: review.contents,
        rating: review.rating || 0,
        reviewImages: undefined,
        createdAt: review.createdAt || new Date()
      }));
    } catch (error) {
      throw new Error('리뷰를 조회할 수 없습니다.');
    }
  }

  async findReviewByUserAndProduct(userId: string, productId: number): Promise<Review | null> {
    try {
      const review = await prisma.review.findFirst({
        where: { userId, productId },
        select: {
          userId: true,
          productId: true,
          orderId: true,
          contents: true,
          rating: true,
          createdAt: true
        }
      });

      if (!review) return null;

      return {
        id: 0, // 기본값
        userId: review.userId,
        productId: review.productId,
        orderId: review.orderId,
        contents: review.contents,
        rating: review.rating || 0,
        reviewImages: undefined,
        createdAt: review.createdAt || new Date()
      };
    } catch (error) {
      throw new Error('리뷰를 조회할 수 없습니다.');
    }
  }

  async findReviewByOrderId(orderId: number): Promise<Review | null> {
    try {
      const review = await prisma.review.findFirst({
        where: { orderId },
        select: {
          userId: true,
          productId: true,
          orderId: true,
          contents: true,
          rating: true,
          createdAt: true
        }
      });

      if (!review) return null;

      return {
        id: 0, // 기본값
        userId: review.userId,
        productId: review.productId,
        orderId: review.orderId,
        contents: review.contents,
        rating: review.rating || 0,
        reviewImages: undefined,
        createdAt: review.createdAt || new Date()
      };
    } catch (error) {
      throw new Error('리뷰를 조회할 수 없습니다.');
    }
  }

  async createReview(review: Omit<Review, 'id'>): Promise<Review> {
    try {
      const createdReview = await prisma.review.create({
        data: {
          userId: review.userId,
          productId: review.productId,
          orderId: review.orderId,
          contents: review.contents,
          rating: review.rating,
          reviewImages: review.reviewImages
        },
        select: {
          userId: true,
          productId: true,
          orderId: true,
          contents: true,
          rating: true,
          createdAt: true
        }
      });

      return {
        id: 0, // 기본값
        userId: createdReview.userId,
        productId: createdReview.productId,
        orderId: createdReview.orderId,
        contents: createdReview.contents,
        rating: createdReview.rating || 0,
        reviewImages: undefined,
        createdAt: createdReview.createdAt || new Date()
      };
    } catch (error) {
      throw new Error('리뷰를 생성할 수 없습니다.');
    }
  }

  // Review 테이블 중심으로 relation 조회
  async findReviewsWithRelations(userId: string): Promise<ReviewWithRelations[]> {
    try {
      const reviews = await prisma.review.findMany({
        where: { userId },
        select: {
          id: true,
          contents: true,
          rating: true,
          createdAt: true,
          // Order relation
          order: {
            select: {
              id: true,
              optionValue: {
                select: {
                  name: true
                }
              }
            }
          },
          // Product relation
          product: {
            select: {
              id: true,
              korName: true,
              engName: true,
              thumbnailImage: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // null 값들을 기본값으로 변환
      return reviews.map(review => ({
        id: review.id,
        contents: review.contents,
        rating: review.rating || 0,
        createdAt: review.createdAt || new Date(),
        order: {
          id: review.order.id,
          optionValue: review.order.optionValue
        },
        product: {
          id: review.product.id,
          korName: review.product.korName,
          engName: review.product.engName,
          thumbnailImage: review.product.thumbnailImage
        }
      }));
    } catch (error) {
      throw new Error('리뷰를 조회할 수 없습니다.');
    }
  }
}

