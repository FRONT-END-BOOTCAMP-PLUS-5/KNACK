// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { GetOrderByIdUseCase } from '@/backend/orders/applications/usecases/GetOrderByIdUseCase'
import { KnackOrderRepository } from '@/backend/orders/repositories/KnackOrderRepository'

type Ctx = { params: Promise<{ id: string }> } // ⬅️ params가 Promise

export async function GET(_req: NextRequest, ctx: Ctx) {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: idStr } = await ctx.params // ⬅️ 반드시 await
    const id = Number(idStr)
    if (!Number.isFinite(id)) {
        return NextResponse.json({ error: 'invalid orderId' }, { status: 400 })
    }

    const usecase = new GetOrderByIdUseCase(new KnackOrderRepository())
    const order = await usecase.execute(id, userId)
    if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    return NextResponse.json(order)
}