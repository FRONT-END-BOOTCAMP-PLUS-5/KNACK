import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { FileUploadRepository } from '../../domains/repositories/FileUploadRepository'

const s3 = new S3Client({
    region: process.env.AWS_REGION, // ✅ 지역을 명시적으로 지정
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

export class S3FileUploadRepository implements FileUploadRepository {
    async generatePresignedUrl(fileName: string, fileType: string, storage: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `${storage}/${fileName}`,
            ContentType: fileType,
            ACL: 'private',
        })

        return await getSignedUrl(s3, command, { expiresIn: 60 })
    }
}
