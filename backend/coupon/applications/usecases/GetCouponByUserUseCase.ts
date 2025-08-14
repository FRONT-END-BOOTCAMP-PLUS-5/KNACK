import { CouponRepository } from '../../domains/repositories/CouponRepository'; import { GetCouponDto } from '../dtos/GetCouponDto';

export class GetCouponByUserUseCase {
    constructor(private readonly repo: CouponRepository) { }
    async execute(userId: string): Promise<GetCouponDto[]> {
        const coupons = await this.repo.findByUserId(userId);
        return coupons.map(coupon => ({
            id: coupon.id, name: coupon.name,
            salePercent: coupon.salePercent,
            productId: coupon.productId,
            createdAt: coupon.mapping.createdAt,
            expirationAt: coupon.expirationAt
        }));
    }
}








