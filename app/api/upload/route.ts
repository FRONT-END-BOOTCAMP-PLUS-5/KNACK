import { S3FileUploadRepository } from '@/backend/infrastructures/repositories/S3FileUploadRepository'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { fileName, fileType, storage } = await req.json()

    const fileUploadRepository = new S3FileUploadRepository()
    const url = await fileUploadRepository.generatePresignedUrl(fileName, fileType, storage)
    return NextResponse.json({ url })
}
