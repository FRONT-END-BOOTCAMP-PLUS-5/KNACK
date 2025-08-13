import { PrismaClient, Prisma } from '@prisma/client'
import { CouponRepository } from '../domains/repositories/CouponRepository'
import { Coupon, CouponMapping } from '../domains/entities/Coupon'

const prisma = new PrismaClient()

export class KnackCouponRepository implements CouponRepository {
    async findByUserId(userId: string): Promise<(Coupon & { mapping: CouponMapping })[]> {
        const coupons = await prisma.coupon.findMany({
            where: {
                couponMappings: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                couponMappings: true
            }
        })
        return coupons.map(coupon => ({
            ...coupon,
            mapping: coupon.couponMappings.find(mapping => mapping.userId === userId)!
        }))
    }

    async consumeByDelete(
        userId: string,
        couponId: number,
        tx?: Prisma.TransactionClient
    ): Promise<void> {
        const db = tx ?? prisma
        const res = await db.couponMapping.deleteMany({
            where: { userId, couponId },
        })
        if (res.count === 0) {
            throw new Error('사용 가능한 쿠폰이 없거나 이미 사용되었습니다.')
        }
    }
}







