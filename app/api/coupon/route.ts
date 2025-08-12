import { NextRequest, NextResponse } from 'next/server';
import { KnackCouponRepository } from '@/backend/coupon/repositories/KnackCouponRepository';
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
        const couponRepository = new KnackCouponRepository();
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














