import prisma from '@/backend/utils/prisma';
import { Brand } from '../domains/entities/Brand';
import { BrandRepository } from '../domains/repositories/BrandRepository';
import { BrandRequestDto } from '../applications/dtos/BrandDto';

export class PrBrandRepository implements BrandRepository {
  async getBrands(requestDto: BrandRequestDto): Promise<Brand[]> {
    const { keyword, key } = requestDto;

    const brands = await prisma.brand.findMany({
      where: {
        isPrivate: true,
        ...(keyword
          ? {
              OR: [
                { korName: { contains: keyword, mode: 'insensitive' } },
                { engName: { contains: keyword, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(key
          ? {
              engName: { startsWith: key, mode: 'insensitive' },
            }
          : {}),
      },
      include: {
        _count: {
          select: {
            brandLike: true,
          },
        },
      },
    });

    return brands.map(
      (brand) => new Brand(brand.id, brand.korName, brand.engName, brand.logoImage, brand._count.brandLike)
    );
  }
}
