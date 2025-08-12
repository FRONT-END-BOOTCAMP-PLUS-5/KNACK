// app/api/payments/[paymentId]/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { KnackPaymentRepository } from '@/backend/payments/repositories/KnackPaymentRepository'
import { GetPaymentOrdersUseCase } from '@/backend/payments/applications/usecases/GetPaymentUseCase'
import { HttpError } from '@/backend/utils/errors'

export async function GET(_req: NextRequest, { params }: { params: { paymentId: string } }) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id
        if (!userId) throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const id = Number(params.paymentId)
        if (!Number.isFinite(id)) throw NextResponse.json('invalid paymentId')

        const usecase = new GetPaymentOrdersUseCase(new KnackPaymentRepository())
        const dto = await usecase.byId(id, userId)
        return NextResponse.json(dto)
    } catch (e: unknown) {
        const err = e as HttpError
        const status = err.status ?? 500
        return NextResponse.json({ error: err.message ?? 'internal_error' }, { status })
    }
}
