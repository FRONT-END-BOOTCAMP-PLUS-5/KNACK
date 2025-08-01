import { NextRequest, NextResponse } from 'next/server'
import { CreateOrderUseCase } from '@/backend/application/usecases/CreateOrderUseCase'
import { KnackOrderRepository } from '@/backend/infrastructure/repositories/KnackOrderRepository'

export async function POST(req: NextRequest) {
    const { userId, items } = await req.json()
    // items: [{ productId, count, price, salePrice? }]

    const useCase = new CreateOrderUseCase(new KnackOrderRepository())

    try {
        const orderIds = await useCase.execute({ userId, items })
        return NextResponse.json({ orderIds })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
