// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { GetOrderByIdUseCase } from '@/backend/orders/applications/usecases/GetOrderByIdUseCase'
import { PrOrderRepository } from '@/backend/orders/repositories/PrOrderRepository'
import { serializeBigInt } from '@/utils/orders'

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const resolvedParams = await params
        const id = Number(resolvedParams.id)
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: 'invalid orderId' }, { status: 400 })
        }

        const usecase = new GetOrderByIdUseCase(new PrOrderRepository())
        const order = await usecase.execute(id, userId)
        if (!order) {
            return NextResponse.json({ error: 'not_found' }, { status: 404 })
        }
        return NextResponse.json(serializeBigInt(order))
    } catch (e) {
        console.error('[GET /api/orders/[id]] failed:', e)
        return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }
}



