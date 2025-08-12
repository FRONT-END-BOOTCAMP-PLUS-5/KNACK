// app/api/points/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { GetAvailablePointsUseCase } from '@/backend/points/applications/usecases/GetAvailablePointsUseCase';
import { KnackUserPointsRepository } from '@/backend/points/repositories/KnackUserPointsRepository';
import { CreditPointsUseCase } from '@/backend/points/applications/usecases/CreditPointsUseCase';
import { DebitPointsUseCase } from '@/backend/points/applications/usecases/DebitPointsUseCase';

// export const runtime = 'nodejs' // (기본값: Node 런타임; edge 지양)

export async function GET(_req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const usecase = new GetAvailablePointsUseCase(new KnackUserPointsRepository());
        const dto = await usecase.execute(userId);

        return NextResponse.json(dto, { status: 200 });
    } catch (e) {
        console.error('GET /api/points failed:', e);
        return NextResponse.json({ error: 'internal_error' }, { status: 500 });
    }
}

// ✅ 증/차감 POST
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const action: string = body.action ?? body.op ?? body.type; // credit | debit
        const amount = Number(body.amount);
        const reason = String(body.reason ?? (action === 'credit' ? 'MANUAL' : 'ORDER_SPEND'));

        if (!action || !['credit', 'debit'].includes(action)) {
            return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
        }
        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ error: 'invalid_amount' }, { status: 400 });
        }

        const repo = new KnackUserPointsRepository();

        if (action === 'credit') {
            const usecase = new CreditPointsUseCase(repo);
            const result = await usecase.execute({ userId, amount, reason });
            return NextResponse.json(result, { status: 200 });
        } else {
            const usecase = new DebitPointsUseCase(repo);
            const result = await usecase.execute({ userId, amount, reason });
            return NextResponse.json(result, { status: 200 });
        }
    } catch (e: unknown) {
        // 레포/유스케이스에서 잔액부족 시 `insufficient_points` 같은 메시지를 던지도록 구현했다면 여기서 맵핑
        const msg = e instanceof Error ? e.message : 'internal_error';
        const status =
            msg === 'insufficient_points' || (typeof e === 'object' && e !== null && 'status' in e && e.status === 400) ? 400 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}
