import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository';

import { GetPaymentsByUserIdUseCase } from '@/backend/payments/applications/usecases/GetPaymentsbyUserIdUseCase';
import { TossConfirmResult } from '@/types/payment';
import { serverPost } from '@/backend/utils/serverRequester';
import axios from 'axios';
import { serializeBigInt } from '@/utils/orders';
import { CreatePaymentUseCase } from '@/backend/payments/applications/usecases/CreatePaymentUseCase';
import { CreatePaymentDto } from '@/backend/payments/applications/dtos/CreatePaymentDto';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;

    const body = await req.json();
    const { tossPaymentKey, amount, pointAmount, orderId, detailAddress, mainAddress, name, zipCode } = body;

    // ✅ 1) 입력값 1차 검증 (개발서버에서 특히 중요)
    if (!tossPaymentKey || !Number.isFinite(Number(amount))) {
      return NextResponse.json({ message: 'bad params', body }, { status: 400 });
    }

    try {
      const tossResult: TossConfirmResult = await serverPost(
        '/payments/confirm',
        { paymentKey: tossPaymentKey, orderId, amount },
        'toss'
      );

      const paymentData: CreatePaymentDto = {
        paymentNumber: tossResult?.paymentKey ? tossResult?.paymentKey?.substring(5, 19) : '0',
        tossPaymentKey: tossResult?.paymentKey,
        price: tossResult?.totalAmount,
        salePrice: pointAmount,
        approvedAt: tossResult?.approvedAt ?? '',
        method: tossResult?.method,
        status: tossResult?.status,
        userId: user?.id,
        detailAddress: detailAddress,
        mainAddress: mainAddress,
        name: name,
        username: user?.name,
        zipCode: zipCode,
      };

      const paymentRepository = new PrPaymentRepository();
      const usecase = new CreatePaymentUseCase(paymentRepository);

      const result = await usecase.create(paymentData);

      return NextResponse.json(
        {
          result: result,
        },
        { status: 200 }
      );
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error('[TOSS CONFIRM ERR]', e.response?.status, e.response?.data);
        const code = e.response?.data?.code;
        const msg = e.response?.data?.message;
        // Toss 에러 코드를 그대로 던져 프론트/로그에서 즉시 확인 가능하게
        throw new Error(`TOSS:${code}:${msg}`);
      }
      throw e;
    }
  } catch (e: unknown) {
    console.error('[POST /api/payments] failed:', e);
    // ✅ Toss 에러면 코드 그대로 노출 (개발 중에만)
    const msg = (e instanceof Error ? e.message : String(e)) || '결제 승인 실패';
    return NextResponse.json({ message: msg }, { status: 400 });
  }
}

export async function GET() {
  // try {
  //   const session = await getServerSession(authOptions);
  //   const userId = session?.user?.id;
  //   if (!userId) {
  //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  //   }
  //   const usecase = new GetPaymentsByUserIdUseCase(new PrPaymentRepository());
  //   const payments = await usecase.execute(userId);
  //   // 응답 포맷 일관성: 객체로 래핑
  //   return NextResponse.json(serializeBigInt({ payments }), { status: 200 });
  // } catch (e) {
  //   console.error('[GET /api/payments] failed:', e);
  //   const msg = e instanceof Error ? e.message : 'internal_error';
  //   return NextResponse.json({ error: msg }, { status: 500 });
  // }
}
