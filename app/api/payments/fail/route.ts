import { NextRequest, NextResponse } from 'next/server';
import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository';

// 클라이언트 실패 리다이렉트에서 보낼 수 있는 최소 파라미터 기준
export async function POST(req: NextRequest) {
  try {
    const { userId, addressId, method = 'TOSS', price = 0 } = await req.json();

    if (!userId || !addressId) {
      return NextResponse.json({ ok: false, message: 'userId/addressId required' }, { status: 400 });
    }

    const repo = new PrPaymentRepository();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('fail log error', e);
    return NextResponse.json({ ok: false, message: 'fail log error' }, { status: 500 });
  }
}
