// ProductImageUploadPage.tsx
'use client'

import React, { useState } from 'react'
import UploadFileComponent from '@/app/(admin)/components/upload/UploadFileComponent'
import { post } from '@/utils/requester'
import styles from './ProductImageUploadPage.module.scss'
import { STORAGE_PATHS } from '@/backend/utils/constants'

export default function ProductImageUploadPage() {
    const [uploadedUrl, setUploadedUrl] = useState<string>('')
    const [fileName, setFileName] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const handleUploadSuccess = (url: string, name: string) => {
        setUploadedUrl(url)
        setFileName(name)
        setMessage('')
    }

    const handleRegister = async () => {
        if (!uploadedUrl) {
            setMessage('이미지를 업로드해주세요.')
            return
        }

        try {
            await post('/api/products/image', {
                imageUrl: uploadedUrl,
                fileName,
            })
            setMessage('✅ 이미지가 성공적으로 등록되었습니다.')
        } catch (err) {
            setMessage('❌ 이미지 등록 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className={styles.container}>
            <h2>상품 이미지 업로드</h2>
            <UploadFileComponent
                uploadUrl="/api/upload"
                storagePath={STORAGE_PATHS.PRODUCT.THUMBNAIL}
            />
            <button className={styles.registerButton} onClick={handleRegister}>
                등록
            </button>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    )
}
