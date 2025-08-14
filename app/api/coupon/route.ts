import { NextRequest, NextResponse } from 'next/server';
import { PrCouponRepository } from '@/backend/coupon/repositories/PrCouponRepository';
import { GetCouponByUserUseCase } from '@/backend/coupon/applications/usecases/GetCouponByUserUseCase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function GET(request: NextRequest) {
    try {
        // Get user session        
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        // Initialize repository and use case
        const couponRepository = new PrCouponRepository();
        const getCouponUseCase = new GetCouponByUserUseCase(couponRepository);
        // Execute use case        
        const coupons = await getCouponUseCase.execute(userId);
        return NextResponse.json({ result: coupons, status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ message: err.message }, { status: 503 });
        } return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
}














