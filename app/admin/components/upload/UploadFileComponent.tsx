'use client'

import React, { useRef, useState } from 'react'
import styles from './UploadFileComponent.module.scss'
import { post, filePut } from '@/utils/requester'

interface Props {
    uploadUrl: string
    storagePath: string
}

export default function UploadFileComponent({ uploadUrl, storagePath }: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string>('')

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const metaRes = await post<{ url: string }>(uploadUrl, {
                fileName: file.name,
                fileType: file.type,
                storage: storagePath,
            })

            await filePut(metaRes.url, file)

            setPreviewUrl(URL.createObjectURL(file))
            setFileName(file.name)
        } catch (err) {
            console.error('파일 업로드 실패:', err)
            alert('파일 업로드 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {previewUrl ? (
                <img src={previewUrl} alt="preview" className={styles.preview} />
            ) : (
                <>
                    <div className={styles.icon} />
                    <span className={styles.text}>여기를 눌러주세요</span>
                </>
            )}
            {fileName && <p className={styles.fileName}>{fileName}</p>}
        </div>
    )
}
