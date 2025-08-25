// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'

import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository'
import { PrCouponRepository } from '@/backend/coupon/repositories/PrCouponRepository'
import { PrUserPointsRepository } from '@/backend/points/repositories/PrUserPointsRepository'
import { PrCardRepository } from '@/backend/payments/repositories/PrCardRepository'

import { ConfirmPaymentUseCase } from '@/backend/payments/applications/usecases/ConfirmPaymentUseCase'
import { GetPaymentsByUserIdUseCase } from '@/backend/payments/applications/usecases/GetPaymentsbyUserIdUseCase'
import { TossGateway } from '@/types/payment'
import { serverPost } from '@/backend/utils/serverRequester'
import { PrOrderRepository } from '@/backend/orders/repositories/PrOrderRepository'

export const runtime = 'nodejs'; // Prisma/Node 모듈이면 안전

import axios from 'axios';
import { serializeBigInt } from '@/utils/orders'

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        const body = await req.json();
        const {
            tossPaymentKey, orderId, amount, addressId, orderIds,
            selectedCouponId, pointsToUse
        } = body;

        // ✅ 1) 입력값 1차 검증 (개발서버에서 특히 중요)
        if (!tossPaymentKey || !orderId || !Number.isFinite(Number(amount))) {
            return NextResponse.json({ message: 'bad params', body }, { status: 400 });
        }
        if (!Number.isFinite(Number(addressId))) {
            return NextResponse.json({ message: 'bad addressId', addressId }, { status: 400 });
        }
        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.json({ message: 'empty orderIds' }, { status: 400 });
        }

        console.log('[POST /api/payments] IN', {
            userId,
            orderId,
            amount: Number(amount),
            addressId: Number(addressId),
            orderIdsLen: orderIds.length,
            mode: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.startsWith('test_') ? 'test' : 'live',
        });

        const tossGateway: TossGateway = {
            async confirmPayment({ tossPaymentKey, orderId, amount }) {
                try {
                    const data = await serverPost('/payments/confirm',
                        { paymentKey: tossPaymentKey, orderId, amount },
                        'toss'
                    );
                    console.log(data);
                    return {
                        paymentKey: data.paymentKey,
                        method: data.method,
                        status: data.status,
                        approvedAt: data.approvedAt,
                        requestedAt: data.requestedAt,
                        amount: data.amount,
                    };
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
            }
        };

        const usecase = new ConfirmPaymentUseCase(
            new PrPaymentRepository(),
            new PrOrderRepository(),
            new PrCouponRepository(),
            new PrUserPointsRepository(),
            tossGateway,
            new PrCardRepository(),
        );

        const result = await usecase.execute({
            userId,
            orderId,
            tossPaymentKey,
            amount: Number(amount),
            addressId: Number(addressId),
            orderIds: (orderIds as number[]) ?? [],
            selectedCouponId: selectedCouponId ? Number(selectedCouponId) : null,
            pointsToUse: pointsToUse ? Number(pointsToUse) : 0,
        });

        return NextResponse.json({
            id: result.id,
            status: result.status,
            paymentNumber: result.paymentNumber ?? null,
            approvedAt: result.approvedAt ?? null,
            method: result.method ?? null,
            orderIds,
            amount: Number(amount),
        }, { status: 201 });

    } catch (e: unknown) {
        console.error('[POST /api/payments] failed:', e);
        // ✅ Toss 에러면 코드 그대로 노출 (개발 중에만)
        const msg = (e instanceof Error ? e.message : String(e)) || '결제 승인 실패';
        return NextResponse.json({ message: msg }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const usecase = new GetPaymentsByUserIdUseCase(new PrPaymentRepository())
        const payments = await usecase.execute(userId)

        // 응답 포맷 일관성: 객체로 래핑
        return NextResponse.json(serializeBigInt({ payments }), { status: 200 })
    } catch (e) {
        console.error('[GET /api/payments] failed:', e)
        const msg = e instanceof Error ? e.message : 'internal_error'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}








