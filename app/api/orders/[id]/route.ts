// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { GetOrderByIdUseCase } from '@/backend/orders/applications/usecases/GetOrderByIdUseCase'
import { KnackOrderRepository } from '@/backend/orders/repositories/KnackOrderRepository'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = Number(params.id)
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'invalid orderId' }, { status: 400 })

    const usecase = new GetOrderByIdUseCase(new KnackOrderRepository())
    const order = await usecase.execute(id, userId)
    if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    return NextResponse.json(order) // DTO라 BigInt 직렬화 이슈 없음
}
