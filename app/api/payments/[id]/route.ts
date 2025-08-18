// app/api/payments/by-number/[paymentNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository';
import { GetOrderInPaymentsUseCase } from '@/backend/payments/applications/usecases/GetOrderInPaymentsUseCase';

export async function GET(_req: NextRequest, context: | { params: { id: string } }
    | { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = 'then' in context.params
            ? await context.params
            : context.params;

        // BigInt 파싱
        let pn: bigint;
        try {
            pn = BigInt(params.id);
        } catch {
            return NextResponse.json({ error: 'invalid paymentNumber' }, { status: 400 });
        }

        const usecase = new GetOrderInPaymentsUseCase(new PrPaymentRepository());
        const dto = await usecase.byNumber(pn, userId);
        if (!dto) {
            return NextResponse.json({ error: 'not_found' }, { status: 404 });
        }

        const body = JSON.stringify(dto, (_k, v) =>
            typeof v === 'bigint' ? v.toString() : v
        );
        return new NextResponse(body, {
            status: 200,
            headers: { 'content-type': 'application/json; charset=utf-8' },
        });
    } catch (e) {
        console.error('GET /api/payments/by-number/[paymentNumber] failed:', e);
        return NextResponse.json(
            { error: 'internal_error' },
            { status: 500 }
        );
    }
}
