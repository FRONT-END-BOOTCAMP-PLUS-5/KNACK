import { Product } from '../domains/review';
import prisma from '../../utils/prisma';

// 상품 리포지토리 인터페이스
export interface ProductRepository {
  findProductById(productId: number): Promise<Product | null>;
}

// Prisma를 사용한 상품 리포지토리 구현
export class PrismaProductRepository implements ProductRepository {
  async findProductById(productId: number): Promise<Product | null> {
    try {
      console.log('🔍 상품 조회 시작 - productId:', productId);
      
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          brand: true
        }
      });
      
      if (!product) {
        console.log('❌ 상품을 찾을 수 없음 - productId:', productId);
        return null;
      }
      
      console.log('✅ 상품 조회 성공:', product.name);
      
      return {
        id: product.id,
        thumbnailImage: product.thumbnailImage || '/images/default-product.jpg',
        engName: product.engName || product.name || '상품명 없음',
        korName: product.korName || product.name || '상품명 없음',
        size: product.size || '사이즈 정보 없음',
        brand: product.brand ? {
          engName: product.brand.engName || '브랜드명 없음',
          korName: product.brand.korName || '브랜드명 없음'
        } : undefined
      };
    } catch (error) {
      console.error('❌ 상품 조회 실패:', error);
      console.error('❌ 오류 상세:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw new Error('상품을 조회할 수 없습니다.');
    }
  }
}
