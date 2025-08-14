import prisma from '@/backend/utils/prisma';
import { Category, SubCategory } from '../domains/entities/Category';
import { CategoryRepository } from '../domains/repositories/CategoryRepository';

export class PrCategoryRepository implements CategoryRepository {
  async getCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: {
        isPrivate: true,
      },
      include: {
        subCategories: {
          where: {
            isPrivate: true,
          },
        },
      },
    });

    return categories.map(
      (category) =>
        new Category(
          category.id,
          category.korName,
          category.engName,
          category.subCategories.map((sub) => new SubCategory(sub.id, sub.korName, sub.engName, sub.categoryId))
        )
    );
  }
}
