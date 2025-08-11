import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { KnackAddressRepository } from '@/backend/address/repositories/KnackAddressRepository'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
        }

        const repo = new KnackAddressRepository()
        const resolvedParams = await params
        const id = parseInt(resolvedParams.id, 10)

        const address = await repo.getById(id)
        if (!address || address.userId !== session.user.id) {
            return NextResponse.json({ message: '해당 주소를 수정할 권한이 없습니다.' }, { status: 403 })
        }

        const body = await req.json()
        const requestMessage =
            typeof body.requestMessage === 'string' ? body.requestMessage :
                typeof body.message === 'string' ? body.message : undefined

        if (typeof requestMessage !== 'string') {
            return NextResponse.json({ message: '요청사항이 올바르지 않습니다.' }, { status: 400 })
        }

        await repo.update({ id, message: requestMessage })
        return NextResponse.json({ message: '요청사항이 수정되었습니다.' })
    } catch (error) {
        console.error('요청사항 수정 실패:', error)
        return NextResponse.json({ message: '요청사항 수정 중 오류 발생' }, { status: 500 })
    }
}
