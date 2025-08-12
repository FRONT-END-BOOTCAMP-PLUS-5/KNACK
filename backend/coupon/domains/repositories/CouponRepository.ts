import { Coupon, CouponMapping } from '../entities/Coupon'
export interface CouponRepository {
    findByUserId(userId: string): Promise<(Coupon & { mapping: CouponMapping })[]>
}

