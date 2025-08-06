import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/auth"
import prisma from "@/backend/utils/prisma"
import { KnackAddressRepository } from '@/backend/address/repositories/KnackAddressRepository'
import { UpdateAddressUseCase } from '@/backend/address/applications/usecases/UpdateAddressUseCase'
import { z } from 'zod'
import { DeleteAddressUseCase } from "@/backend/address/applications/usecases/DeleteAddressUseCase"

const repo = new KnackAddressRepository()
const updateAddressUseCase = new UpdateAddressUseCase(repo)

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
        }

        const addressId = parseInt(params.id, 10)
        if (isNaN(addressId)) {
            return NextResponse.json({ message: '유효하지 않은 주소 ID입니다.' }, { status: 400 })
        }

        const existing = await prisma.address.findUnique({
            where: { id: addressId },
        })

        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ message: '해당 주소를 수정할 권한이 없습니다.' }, { status: 403 })
        }

        // 모든 주소 isDefault 해제
        await prisma.address.updateMany({
            where: { userId: session.user.id },
            data: { isDefault: false },
        })

        // 대상 주소만 true로 설정
        const updated = await prisma.address.update({
            where: { id: addressId },
            data: { isDefault: true },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('기본 배송지 설정 실패:', error)
        return NextResponse.json(
            { message: '기본 배송지 설정 중 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}

const AddressUpdateSchema = z.object({
    name: z.string(),
    phone: z.string().nullable(),
    zipCode: z.string(),
    main: z.string(),
    detail: z.string().nullable(),
    message: z.string().nullable(),
    isDefault: z.boolean().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
        }

        const id = parseInt(params.id, 10)
        if (isNaN(id)) {
            return NextResponse.json({ message: '유효하지 않은 주소 ID입니다.' }, { status: 400 })
        }

        const body = await req.json()
        const result = AddressUpdateSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { message: '유효하지 않은 입력값입니다.', error: result.error.format() },
                { status: 400 }
            )
        }

        const data = result.data

        const existing = await prisma.address.findUnique({ where: { id } })
        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ message: '해당 주소를 수정할 권한이 없습니다.' }, { status: 403 })
        }

        // isDefault가 true일 경우 기존 주소들을 전부 false로 초기화
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false },
            })
        }

        await prisma.address.update({
            where: { id },
            data,
        })

        return NextResponse.json({ message: '주소가 성공적으로 수정되었습니다.' })
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        console.error('주소 수정 실패:', error)

        return NextResponse.json(
            { message: '주소 수정 중 오류 발생', error: message },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
        }

        const addressId = parseInt(params.id, 10)
        if (isNaN(addressId)) {
            return NextResponse.json({ message: '주소 ID가 유효하지 않습니다.' }, { status: 400 })
        }

        const existing = await prisma.address.findUnique({ where: { id: addressId } })

        if (!existing) {
            return NextResponse.json({ message: '주소를 찾을 수 없습니다.' }, { status: 404 })
        }

        if (existing.userId !== session.user.id) {
            return NextResponse.json({ message: '해당 주소를 삭제할 권한이 없습니다.' }, { status: 403 })
        }

        await prisma.address.delete({ where: { id: addressId } })

        return NextResponse.json({ message: '주소가 성공적으로 삭제되었습니다.' })
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        console.error('주소 삭제 실패:', error)

        return NextResponse.json(
            { message: '주소 삭제 중 오류 발생', error: message },
            { status: 500 }
        )
    }
}
