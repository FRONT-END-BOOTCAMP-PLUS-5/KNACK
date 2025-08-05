export interface FileUploadRepository {
    generatePresignedGetUrl(key: string): Promise<string>;
    generatePresignedUrl(fileName: string, fileType: string, keyUrl: string): Promise<string>;
    deleteFile(key: string): Promise<void>
}