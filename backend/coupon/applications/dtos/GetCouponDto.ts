export interface GetCouponDto {
    id: number;
    name: string;
    salePercent: number | null;
    productId: number;
    createdAt: Date | null;
    expirationAt: Date | null;
}



