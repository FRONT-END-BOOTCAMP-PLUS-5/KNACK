import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/auth"
import { z } from 'zod'
import { UpdateAddressUseCase } from "@/backend/address/applications/usecases/UpdateAddressUseCase"
import { PrAddressRepository } from "@/backend/address/repositories/PrAddressRepository"
import { DeleteAddressUseCase } from "@/backend/address/applications/usecases/DeleteAddressUseCase"

export async function PATCH(req: Request | NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
        }

        const repo = new PrAddressRepository()
        const resolvedParams = await params
        const id = parseInt(resolvedParams.id, 10)

        const address = await repo.getById(id)
        if (!address || address.userId !== session.user.id) {
            return NextResponse.json({ message: '해당 주소를 수정할 권한이 없습니다.' }, { status: 403 })
        }

        await repo.setDefault(id)

        return NextResponse.json({ message: '기본 주소가 설정되었습니다.' })
    } catch (error) {
        console.error('기본 배송지 설정 실패:', error)
        return NextResponse.json({ message: '기본 배송지 설정 중 오류 발생' }, { status: 500 })
    }
}

const AddressUpdateSchema = z.object({
    id: z.number(),
    name: z.string(),
    phone: z.string().nullable(),
    zipCode: z.string(),
    main: z.string(),
    detail: z.string().nullable(),
    message: z.string().nullable().optional(),
    isDefault: z.boolean().optional(),
})

export async function PUT(req: Request | NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
        }

        const resolvedParams = await params
        const id = parseInt(resolvedParams.id, 10)
        const body = await req.json()
        const payload = { ...body, id }

        const parsed = AddressUpdateSchema.safeParse(payload)
        if (!parsed.success) {
            return NextResponse.json(
                { message: '유효하지 않은 입력값입니다.', error: parsed.error.format() },
                { status: 400 }
            )
        }

        const repo = new PrAddressRepository()
        const useCase = new UpdateAddressUseCase(repo)

        const existing = await repo.getById(id)
        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ message: '해당 주소를 수정할 권한이 없습니다.' }, { status: 403 })
        }

        await useCase.execute(parsed.data)

        return NextResponse.json({ message: '주소가 성공적으로 수정되었습니다.' })
    } catch (error) {
        console.error('주소 수정 실패:', error)
        return NextResponse.json({ message: '주소 수정 중 오류 발생' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request | NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
        }

        const resolvedParams = await params
        const id = parseInt(resolvedParams.id, 10)
        if (isNaN(id)) {
            return NextResponse.json({ message: '주소 ID가 유효하지 않습니다.' }, { status: 400 })
        }

        const repo = new PrAddressRepository()
        const useCase = new DeleteAddressUseCase(repo)

        await useCase.execute(id, session.user.id)

        return NextResponse.json({ message: '주소가 성공적으로 삭제되었습니다.' })
    } catch (error: unknown) {
        console.error('주소 삭제 실패:', error)

        return NextResponse.json(
            { message: (error as Error).message || '주소 삭제 중 오류 발생' },
            { status: 500 }
        )
    }
}
