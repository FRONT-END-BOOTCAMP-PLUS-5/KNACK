// app/api/payments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository';
import { GetOrderInPaymentsUseCase } from '@/backend/payments/applications/usecases/GetOrderInPaymentsUseCase';
import { serializeBigInt } from '@/utils/orders';

type Params = { id: string };
const INT32_MAX = BigInt(2147483647);
const INT32_MIN = BigInt(-2147483648);

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: raw } = await params;

    // 숫자 문자열만 허용
    if (!/^\d+$/.test(raw)) {
      return NextResponse.json({ error: 'invalid id' }, { status: 400 });
    }

    const asBig = BigInt(raw);
    const usecase = new GetOrderInPaymentsUseCase(new PrPaymentRepository());

    // // ✅ INT32 범위면 paymentId로 처리
    // if (asBig <= INT32_MAX && asBig >= INT32_MIN) {
    //   const paymentId = Number(asBig);
    //   const dto = await usecase.byId(paymentId, userId);
    //   if (!dto) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    //   return NextResponse.json(serializeBigInt(dto), { status: 200 });
    // }

    // // ✅ 그보다 크면 paymentNumber(BigInt)로 처리
    // //  └ Prisma 스키마에서 paymentNumber가 BigInt 컬럼이어야 함
    // const dto = await usecase.byNumber(String(asBig) /* bigint */, userId);
    // if (!dto) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    // // BigInt 직렬화
    // return new NextResponse(
    //   JSON.stringify(dto, (_k, v) => (typeof v === 'bigint' ? v.toString() : v)),
    //   { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } }
    // );
  } catch (e) {
    console.error('GET /api/payments/[id] failed:', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
