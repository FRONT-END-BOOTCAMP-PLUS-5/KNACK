import { Product } from '../domains/entities/Product';
import prisma from '../../utils/prisma';

// 상품 리포지토리 인터페이스
export interface ProductRepository {
  findProductById(productId: number): Promise<Product | null>;
}

// Prisma를 사용한 상품 리포지토리 구현
export class PrismaProductRepository implements ProductRepository {
  async findProductById(productId: number): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          brand: true
        }
      });
      
      if (!product) {
        return null;
      }
      
      return {
        id: product.id,
        thumbnailImage: product.thumbnailImage || '/images/default-product.jpg',
        engName: product.engName || '상품명 없음',
        korName: product.korName || '상품명 없음',
        size: '사이즈 정보 없음', // 현재 DB 스키마에는 size 필드가 없음
        brand: product.brand ? {
          engName: product.brand.engName || '브랜드명 없음',
          korName: product.brand.korName || '브랜드명 없음'
        } : undefined
      };
    } catch (error) {
      console.error('상품 조회 실패:', error);
      throw new Error('상품을 조회할 수 없습니다.');
    }
  }
}
