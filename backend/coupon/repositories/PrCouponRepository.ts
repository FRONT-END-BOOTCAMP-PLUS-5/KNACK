import prisma from '@/backend/utils/prisma';
import { CouponRepository } from '../domains/repositories/CouponRepository';
import { Coupon, CouponMapping } from '../domains/entities/Coupon';
import { Prisma } from '@prisma/client';

export class PrCouponRepository implements CouponRepository {
  async findByUserId(userId: string): Promise<(Coupon & { mapping: CouponMapping })[]> {
    const coupons = await prisma.coupon.findMany({
      where: {
        couponMappings: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        couponMappings: true,
      },
    });
    return coupons.map((coupon) => ({
      ...coupon,
      mapping: coupon.couponMappings.find((mapping) => mapping.userId === userId)!,
    }));
  }

  async consumeByDelete(userId: string, couponId: number, tx?: Prisma.TransactionClient): Promise<void> {
    const db = tx ?? prisma;
    const res = await db.couponMapping.deleteMany({
      where: { userId, couponId },
    });
    if (res.count === 0) {
      throw new Error('사용 가능한 쿠폰이 없거나 이미 사용되었습니다.');
    }
  }

  async deleteById(userId: string, id: number): Promise<number> {
    const findCoupon = await prisma.couponMapping.findFirst({
      where: {
        couponId: id,
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    const result = await prisma.couponMapping.delete({
      where: {
        id: findCoupon?.id,
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    return result?.id;
  }
}
