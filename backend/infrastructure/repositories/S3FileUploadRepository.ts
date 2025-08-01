import { FileUploadRepository } from '@/backend/domain/repositories/FileUploadRepository';
import { s3 } from '@/backend/infrastructure/database/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3FileUploadRepository implements FileUploadRepository {
    async generatePresignedUrl(fileName: string, fileType: string, keyUrl: string) {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `${keyUrl}/${fileName}`,
            ContentType: fileType,
        });
        return await getSignedUrl(s3, command, { expiresIn: 60 });
    }
}
