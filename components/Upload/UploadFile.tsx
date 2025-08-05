'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import styles from './UploadFile.module.scss'
import requester, { post, filePut } from '@/utils/requester'

interface Props {
    uploadUrl: string
    storagePath: string
}

interface UploadedFile {
    name: string
    previewUrl: string
    s3Key: string
}

export default function UploadFile({ uploadUrl, storagePath }: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string>('')
    const [s3Key, setS3Key] = useState<string>('') // ✅ 현재 업로드된 파일의 S3 키

    const [hoverImage, setHoverImage] = useState<string | null>(null)
    const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const newKey = `${storagePath}/${file.name}`

        try {
            // ✅ 이전 파일이 있다면 삭제 요청
            if (s3Key) {
                await requester.delete('/api/upload', { data: { key: s3Key } })
            }

            // ✅ 새 presigned URL 발급
            const metaRes = await post<{ url: string }>(uploadUrl, {
                fileName: file.name,
                fileType: file.type,
                storage: storagePath,
            })

            await filePut(metaRes.url, file)

            setPreviewUrl(URL.createObjectURL(file))
            setFileName(file.name)
            setS3Key(newKey) // ✅ 새로 업로드한 키로 갱신

            // ✅ input 초기화
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

        } catch (err) {
            console.error('파일 업로드 실패:', err)
            alert('파일 업로드 중 오류가 발생했습니다.')
        }
    }

    const handleDelete = async () => {
        const confirmDelete = confirm(`${fileName} 파일을 삭제할까요?`)
        if (!confirmDelete) return

        try {
            if (s3Key) {
                await requester.delete('/api/upload', { data: { key: s3Key } })
            }

            // 상태 초기화
            setPreviewUrl(null)
            setFileName('')
            setS3Key('')
        } catch (e) {
            console.error('파일 삭제 실패:', e)
            alert('파일 삭제 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className={styles.upload_box} onClick={() => fileInputRef.current?.click()}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {previewUrl ? (
                <div className={styles.preview_wrapper}>
                    <Image
                        src={previewUrl}
                        alt="preview"
                        width={150}
                        height={150}
                        className={styles.preview}
                        onMouseEnter={() => setHoverImage(previewUrl)}
                        onMouseLeave={() => setHoverImage(null)}
                        onMouseMove={(e) => setHoverPos({ x: e.clientX + 20, y: e.clientY + 20 })}
                    />
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                        className={styles.delete_btn}>X</button>
                </div>
            ) : (
                <>
                    <div className={styles.icon} />
                    <span className={styles.text}>여기를 눌러주세요</span>
                </>
            )}
            {fileName && <p className={styles.fileName}>{fileName}</p>}

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
