'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import styles from './UploadFile.module.scss'
import requester, { post, filePut } from '@/utils/requester'
import Button from '../common/Button'

interface Props {
    uploadUrl: string
    storagePath: string
}

interface UploadedFile {
    name: string
    previewUrl: string
    s3Key: string
}

export default function UploadMultiFile({ uploadUrl, storagePath }: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

    const [hoverImage, setHoverImage] = useState<string | null>(null)
    const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const fileArray = Array.from(files)
        const newFiles: UploadedFile[] = []

        for (const file of fileArray) {
            try {
                const s3Key = `${storagePath}/${file.name}`
                const metaRes = await post<{ url: string }>(uploadUrl, {
                    fileName: file.name,
                    fileType: file.type,
                    storage: storagePath,
                })

                await filePut(metaRes.url, file)

                newFiles.push({
                    name: file.name,
                    previewUrl: URL.createObjectURL(file),
                    s3Key,
                })
            } catch (err) {
                console.error(`파일 업로드 실패 (${file.name}):`, err)
                alert(`파일 업로드 중 오류 발생: ${file.name}`)
            }
        }

        setUploadedFiles((prev) => [...prev, ...newFiles])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleDelete = async (file: UploadedFile) => {
        try {
            await requester.delete('/api/upload', { data: { key: file.s3Key } })
            setUploadedFiles((prev) => prev.filter((f) => f.s3Key !== file.s3Key))
        } catch (e) {
            console.error('파일 삭제 실패:', e)
            alert('파일 삭제 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className={styles.upload_wrapper}>
            <div>
                <Button text="파일 선택" size='medium' onClick={() => fileInputRef.current?.click()} />
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={handleFileChange}
                className={styles.file_input}
            />

            {uploadedFiles.length > 0 ? (
                <div className={styles.slider_wrapper}>
                    <ul className={styles.preview_list}>
                        {uploadedFiles.map((file, idx) => (
                            <li key={idx} className={styles.preview_item}>
                                <Image
                                    src={file.previewUrl}
                                    alt={file.name}
                                    fill
                                    className={styles.preview_image}
                                    onMouseEnter={() => setHoverImage(file.previewUrl)}
                                    onMouseLeave={() => setHoverImage(null)}
                                    onMouseMove={(e) => setHoverPos({ x: e.clientX + 20, y: e.clientY + 20 })}
                                />
                                <p className={styles.file_name}>{file.name}</p>
                                <button onClick={() => handleDelete(file)} className={styles.delete_btn}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <>
                    <div className={styles.icon} />
                    <span className={styles.text}>여러 개의 파일을 선택하세요</span>
                </>
            )}

            {hoverImage && (
                <div
                    className={styles.zoom_preview}
                    style={{
                        left: `${hoverPos.x}px`,
                        top: `${hoverPos.y}px`,
                    }}
                >
                    <Image src={hoverImage} alt="Zoom" width={200} height={200} />
                </div>
            )}
        </div>
    )
}
