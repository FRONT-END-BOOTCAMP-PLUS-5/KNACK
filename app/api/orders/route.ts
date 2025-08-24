// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { CreateOrderUseCase } from '@/backend/orders/applications/usecases/CreateOrderUseCase'
import { GetOrderAmountByIdUseCase } from '@/backend/orders/applications/usecases/GetOrderAmountByIdUseCase'
import { PrOrderRepository } from '@/backend/orders/repositories/PrOrderRepository'
import { serializeBigInt } from '@/utils/orders'

export const runtime = 'nodejs' // ✅ next-auth 세션 위해 Node 런타임

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { items } = await req.json()
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'items required' }, { status: 400 })
        }

        const useCase = new CreateOrderUseCase(new PrOrderRepository())
        const orderIds = await useCase.execute({ userId, items })
        return NextResponse.json({ orderIds })
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unexpected error'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}


export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const useCase = new GetOrderAmountByIdUseCase(new PrOrderRepository())
        const orders = await useCase.execute(userId)

        return NextResponse.json(serializeBigInt({ orders }))
    } catch (e) {
        console.error('GET /api/orders failed:', e)
        const msg = e instanceof Error ? e.message : 'Unexpected error'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}
