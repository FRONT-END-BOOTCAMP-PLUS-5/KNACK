import { NextRequest, NextResponse } from 'next/server'
import { CreateOrderUseCase } from '@/backend/orders/applications/usecases/CreateOrderUseCase'
import { PrOrderRepository } from '@/backend/orders/repositories/PrOrderRepository'

export async function POST(req: NextRequest) {
    const { userId, items } = await req.json()
    // items: [{ productId, count, price, salePrice? }]

    const useCase = new CreateOrderUseCase(new PrOrderRepository())

    try {
        const orderIds = await useCase.execute({ userId, items })
        return NextResponse.json({ orderIds })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
