export interface FileUploadRepository {
    generatePresignedUrl(fileName: string, fileType: string, keyUrl: string): Promise<string>;
    deleteFile(key: string): Promise<void>
}