// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { GetOrderByIdUseCase } from '@/backend/orders/applications/usecases/GetOrderByIdUseCase'
import { PrOrderRepository } from '@/backend/orders/repositories/PrOrderRepository'
import { RouteContext } from '@/types/order'

export async function GET(_req: NextRequest, { params }: RouteContext) {
    try {
        // 인증
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 파라미터 검증
        const id = Number(params.id)
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: 'invalid orderId' }, { status: 400 })
        }

        // 유스케이스 실행
        const usecase = new GetOrderByIdUseCase(new PrOrderRepository())
        const order = await usecase.execute(id, userId)

        if (!order) {
            return NextResponse.json({ error: 'not_found' }, { status: 404 })
        }

        return NextResponse.json(order)
    } catch (e) {
        console.error('[GET /api/orders/[id]] failed:', e)
        return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }
}
