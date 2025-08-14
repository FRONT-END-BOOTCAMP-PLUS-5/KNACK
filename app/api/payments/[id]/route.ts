// app/api/payments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { PrPaymentRepository } from '@/backend/payments/repositories/PrPaymentRepository'
import { GetPaymentOrdersUseCase } from '@/backend/payments/applications/usecases/GetPaymentUseCase'
import { HttpError } from '@/backend/utils/errors'

type Ctx = { params: Promise<{ id: string }> } // ⬅️ params는 Promise

export async function GET(_req: NextRequest, ctx: Ctx) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // ⬅️ 반드시 await 해서 꺼내기
        const { id: idStr } = await ctx.params
        const id = Number(idStr)
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: 'invalid paymentId' }, { status: 400 })
        }

        const usecase = new GetPaymentOrdersUseCase(new PrPaymentRepository())
        const dto = await usecase.byId(id, userId)
        if (!dto) return NextResponse.json({ error: 'not_found' }, { status: 404 })

        // BigInt 안전 직렬화
        const safeDto = JSON.parse(
            JSON.stringify(dto, (_k, v) => (typeof v === 'bigint' ? v.toString() : v))
        )

        return NextResponse.json(safeDto, { status: 200 })
    } catch (e: unknown) {
        if (e instanceof Response) return e
        console.error('GET /api/payments/[id] failed:', e)
        const err = e as HttpError
        return NextResponse.json(
            { error: err?.message ?? 'internal_error' },
            { status: err?.status ?? 500 }
        )
    }
}
