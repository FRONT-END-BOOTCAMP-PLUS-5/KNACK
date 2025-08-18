export interface Coupon {
    id: number;
    name: string; salePercent: number | null;
    productId: number;
    createdAt: Date | null;
    expirationAt: Date | null
}

export interface CouponMapping {
    id: number;
    userId: string; couponId: number;
    createdAt: Date | null;
}



;


