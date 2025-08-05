import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { FileUploadRepository } from '../../domains/repositories/FileUploadRepository'
import { s3 } from '../database/s3Client'

export class S3FileUploadRepository implements FileUploadRepository {
    async generatePresignedUrl(fileName: string, fileType: string, storage: string): Promise<string> {
        const key = `${storage}/${fileName}`

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
            ContentType: fileType,
            ACL: 'private',
        })

        return await getSignedUrl(s3, command, { expiresIn: 60 })
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
        })

        await s3.send(command)
    }
}
