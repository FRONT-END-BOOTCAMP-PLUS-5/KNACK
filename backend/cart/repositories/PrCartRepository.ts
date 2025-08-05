import prisma from '@/backend/utils/prisma';
import { CartRepository } from '../domains/repositires/CartRepository';
import { Cart } from '../domains/entities/Cart';

interface IProps {
  userId: string;
  productId: number;
  optionMappingId: number;
  count: number;
}

export class PrCartRepository implements CartRepository {
  private cartData;

  constructor(cartData?: IProps) {
    this.cartData = cartData;
  }

  async insertCart(): Promise<number> {
    const { count, optionMappingId, productId, userId } = this.cartData ?? {};

    const result = await prisma.cart.create({
      data: {
        productId: productId ?? 0,
        count: count ?? 0,
        optionMappingId: optionMappingId ?? 0,
        userId: userId ?? '',
      },
    });

    return result.id;
  }

  async getCart(): Promise<Cart[]> {
    const result = await prisma.cart.findMany({
      where: { userId: '7571e92b-f38b-4878-959c-f76ab9290ed8' },
      include: {
        productOptionMapping: { include: { optionType: { include: { optionValue: true } } } },
        product: { include: { brand: true, category: true } },
      },
    });

    return result;
  }

  async remove(id: number): Promise<number> {
    const result = await prisma.cart.delete({
      where: { id: id },
    });

    return result.id;
  }
}
