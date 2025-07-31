import { NextRequest, NextResponse } from 'next/server';
import { S3FileUploadRepository } from '@/backend/infrastructure/repositories/S3FileUploadRepository';

export async function POST(req: NextRequest, storage: string) {
    const { fileName, fileType } = await req.json();
    const fileUploadRepository = new S3FileUploadRepository();
    const url = await fileUploadRepository.generatePresignedUrl(fileName, fileType, storage);
    return NextResponse.json({ url });
}