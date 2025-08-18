import { Coupon, CouponMapping } from '../entities/Coupon'
import { Prisma } from '@prisma/client'

export interface CouponRepository {
    findByUserId(userId: string): Promise<(Coupon & { mapping: CouponMapping })[]>
    consumeByDelete(userId: string, couponId: number, tx?: Prisma.TransactionClient): Promise<void>
}

