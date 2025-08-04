import prisma from '@/backend/utils/prisma';
import { CartRepository } from '../domains/repositires/CartRepository';

interface IProps {
  userId: string;
  productId: number;
  option_mapping_id: number;
  count: number;
}

export class PrCartRepository implements CartRepository {
  private cartData;

  constructor(cartData: IProps) {
    this.cartData = cartData;
  }

  async insertCart(): Promise<number> {
    const { count, option_mapping_id, productId, userId } = this.cartData;

    const result = await prisma.cart.create({
      data: {
        productId: productId,
        count: count,
        optionMappingId: option_mapping_id,
        userId: userId,
      },
    });

    return result.id;
  }
}
