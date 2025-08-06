import { NextRequest, NextResponse } from 'next/server'
import { KnackAddressRepository } from '@/backend/address/repositories/KnackAddressRepository'
import { UpdateAddressUseCase } from '@/backend/address/applications/usecases/UpdateAddressUseCase'
import { CreateAddressUseCase } from '@/backend/address/applications/usecases/CreateAddressUseCase'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/auth'
import { GetAddressByUserIdUseCase } from '@/backend/address/applications/usecases/GetAddressByUserIdUseCase'

const repo = new KnackAddressRepository()
const getAddressByUserIdUseCase = new GetAddressByUserIdUseCase(repo)

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 })
        }

        const addressList = await getAddressByUserIdUseCase.execute(session.user.id)

        return NextResponse.json(addressList)
    } catch (error) {
        console.error('주소 목록 조회 실패:', error)
        return NextResponse.json(
            { message: '주소 조회 중 오류 발생', error: (error as Error).message },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
        }

        const userId = session.user.id // UUID string
        const body = await req.json()

        const createAddress = new CreateAddressUseCase(repo)

        const newAddress = await createAddress.execute({
            ...body,
            userId, // ✅ 세션에서 직접 주입
        })

        return NextResponse.json(newAddress, { status: 201 })
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        console.error('주소 생성 실패:', error)

        return NextResponse.json(
            { message: '주소 생성 중 오류 발생', error: message },
            { status: 400 }
        )
    }
}

