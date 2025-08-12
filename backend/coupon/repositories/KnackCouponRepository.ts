import { PrismaClient } from '@prisma/client'
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
}







