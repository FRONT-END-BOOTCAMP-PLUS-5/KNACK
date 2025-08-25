// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/auth'
import { GetOrderByIdUseCase } from '@/backend/orders/applications/usecases/GetOrderByIdUseCase'
import { PrOrderRepository } from '@/backend/orders/repositories/PrOrderRepository'
import { serializeBigInt } from '@/utils/orders'
import { DeliveryStatus } from '@/backend/orders/applications/dtos/CreateOrderEntityDto'
import { GetOrderAmountByIdUseCase } from '@/backend/orders/applications/usecases/GetOrderAmountByIdUseCase'
import { UpdateOrderStatusUseCase } from '@/backend/orders/applications/usecases/UpdateOrderStatusUseCase'

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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id: raw } = await params;
        if (!/^\d+$/.test(raw)) return NextResponse.json({ error: 'invalid id' }, { status: 400 });

        const orderId = Number(raw);
        const repository = new PrOrderRepository();
        const order = await repository.findByIdWithAddress(orderId, userId);

        if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 });
        if (order.userId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

        const status = DeliveryStatus.CONFIRMED;

        const usecase = new UpdateOrderStatusUseCase(repository);
        await usecase.execute(orderId, status);

        return NextResponse.json({ message: 'Order status updated to CONFIRMED', status });
    } catch (e) {
        console.error('[PUT /api/orders/[id]] failed:', e);
        return NextResponse.json({
            error: e instanceof Error ? e.message : 'internal_error'
        }, { status: 500 });
    }
}


