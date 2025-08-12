// app/api/points/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { GetAvailablePointsUseCase } from '@/backend/points/applications/usecases/GetAvailablePointsUseCase';
import { KnackUserPointsRepository } from '@/backend/points/repositories/KnackUserPointsRepository';

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
