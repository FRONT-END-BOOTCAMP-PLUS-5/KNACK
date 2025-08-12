// app/api/payments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { KnackPaymentRepository } from '@/backend/payments/repositories/KnackPaymentRepository'
import { GetPaymentOrdersUseCase } from '@/backend/payments/applications/usecases/GetPaymentUseCase'
import { HttpError } from '@/backend/utils/errors'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 🚩 폴더명이 [id] 이므로 params.id 사용
        const id = Number(params.id)
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: 'invalid paymentId' }, { status: 400 })
        }

        const usecase = new GetPaymentOrdersUseCase(new KnackPaymentRepository())
        const dto = await usecase.byId(id, userId)

        // BigInt 안전 직렬화
        const safeDto = JSON.parse(
            JSON.stringify(dto, (_k, v) => (typeof v === 'bigint' ? v.toString() : v))
        )

        return NextResponse.json(safeDto, { status: 200 })
    } catch (e: unknown) {
        if (e instanceof Response) return e
        console.error('GET /api/payments/[id] failed:', e)
        const err = e as HttpError
        return NextResponse.json({ error: err?.message ?? 'internal_error' }, { status: err?.status ?? 500 })
    }
}
