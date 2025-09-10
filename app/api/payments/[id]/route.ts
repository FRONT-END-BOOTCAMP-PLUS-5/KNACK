import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { GetOrderInPaymentsUseCase } from '@/backend/payments/applications/usecases/GetOrderInPaymentsUseCase';
import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository';

type Params = { id: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // 숫자 문자열만 허용
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'invalid id' }, { status: 400 });
    }

    const repository = new PrPaymentRepository();
    const usecase = new GetOrderInPaymentsUseCase(repository);
    const payment = await usecase.execute(Number(id), userId);

    return NextResponse.json({ payment }, { status: 200 });
  } catch (e) {
    console.error('GET /api/payments/[id] failed:', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
