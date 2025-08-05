import { s3 } from '@/backend/uploads/infrastructures/database/s3Client'
import { S3FileUploadRepository } from '@/backend/uploads/infrastructures/repositories/S3FileUploadRepository'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

const fileUploadRepository = new S3FileUploadRepository()

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (!key) {
        return NextResponse.json({ error: 'Missing key' }, { status: 400 })
    }

    try {
        const url = await fileUploadRepository.generatePresignedGetUrl(key)
        return NextResponse.json({ url })
    } catch (e) {
        return NextResponse.json({ error: 'URL 생성 실패' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { fileName, fileType, storage } = await req.json()

    const url = await fileUploadRepository.generatePresignedUrl(fileName, fileType, storage)
    return NextResponse.json({ url })
}

export async function DELETE(req: NextRequest) {
    const { key } = await req.json()

    if (!key) {
        return NextResponse.json({ message: 'Key is required' }, { status: 400 })
    }

    try {
        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
        }))

        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (e) {
        console.error('S3 삭제 실패:', e)
        return NextResponse.json({ message: 'S3 삭제 실패' }, { status: 500 })
    }
}