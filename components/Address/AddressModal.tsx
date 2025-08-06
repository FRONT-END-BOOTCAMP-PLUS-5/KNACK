'use client'

import { useEffect, useState } from 'react'
import { useAddressStore } from '@/store/useAddressStore'
import KakaoPostCodeLoader from './KakaoPostCodeLoader'
import { openKakaoPostcode } from '@/utils/openKakaoPostCode'
import styles from './AddressModal.module.scss'
import requester from '@/utils/requester'

interface Address {
    id: number
    name: string
    phone: string
    zipCode: string
    main: string
    detail: string
    message: string
    isDefault?: boolean
}

interface Props {
    onClose: () => void
}

export default function AddressModal({ onClose }: Props) {
    const { selectedAddress, setSelectedAddress } = useAddressStore()
    const [step, setStep] = useState<'list' | 'form'>('list')
    const [fullAddress, setFullAddress] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [request, setRequest] = useState('')
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([])

    const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
    const [userId, setUserId] = useState<string>('') // ✅ 사용자 ID

    const handleSearch = () => {
        openKakaoPostcode(({ full, zipCode }) => {
            console.log(full, zipCode)
            setFullAddress(full)
            setZipCode(zipCode)
            setStep('form')
        })
    }

    const handleSetDefault = async (id: number) => {
        try {
            await requester.patch(`/api/addresses/${id}`)
            const updated = savedAddresses.map((a) => ({
                ...a,
                isDefault: a.id === id,
            }))
            setSavedAddresses(updated)
        } catch (e) {
            alert('기본 배송지 설정 실패')
        }
    }

    const handleEdit = (addr: Address) => {
        setEditingAddressId(addr.id)
        setFullAddress(addr.main)
        setName(addr.name)
        setPhone(addr.phone)
        setZipCode(addr.zipCode)
        setRequest(addr.detail)
        setStep('form')
    }

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        try {
            await requester.delete(`/api/addresses/${id}`)
            setSavedAddresses((prev) => prev.filter((a) => a.id !== id))
        } catch (e) {
            alert('삭제 실패')
        }
    }

    const handleSubmit = async () => {
        if (!name || !phone || !fullAddress || !zipCode) {
            alert('모든 필드를 입력해주세요.')
            return
        }

        const payload = {
            // userId는 서버에서 세션으로 주입되므로 프론트에서 보낼 필요 없음
            name,
            phone,
            zipCode,
            main: fullAddress,      // ✅ 정확한 전체 주소 그대로
            detail: request,        // ✅ 상세주소
        }

        try {
            let saved
            if (editingAddressId !== null) {
                const res = await requester.put(`/api/addresses/${editingAddressId}`, payload)
                console.log(res)
                saved = res.data
            } else {
                const res = await requester.post('/api/addresses', payload)
                saved = res.data
            }

            const newAddress = {
                id: saved.id,
                name: saved.name,
                phone: saved.phone ?? '',
                fullAddress: `${saved.main} ${saved.detail ?? ''}`.trim(),
                request: saved.message ?? '',
            }

            setSelectedAddress(newAddress)
            onClose()
        } catch (error) {
            console.error('주소 저장 실패:', error)
            alert('주소 저장에 실패했습니다.')
        }
    }

    const handleSelectSaved = (addr: Address) => {
        setSelectedAddress({
            id: addr.id,
            name: addr.name,
            phone: addr.phone ?? '',
            fullAddress: `${addr.main} ${addr.detail ?? ''}`.trim(),
            request: addr.message ?? '',
        })
        onClose()
    }

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await requester.get(`/api/addresses`)
                setSavedAddresses(res.data)
            } catch (e) {
                console.error('주소 목록 불러오기 실패:', e)
            }
        }

        fetchAddresses()
    }, [])

    return (
        <div className={styles.modal_overlay}>
            <KakaoPostCodeLoader />
            <div className={styles.modal}>
                <h3 className={styles.title}>배송지 선택</h3>
                <button className={styles.close_btn} onClick={onClose}>✕</button>


                {savedAddresses.map((addr) => (
                    <div key={addr.id} className={styles.saved_item}>
                        <label className={styles.radio_line}>
                            <input
                                type="radio"
                                name="selectedAddress"
                                checked={selectedAddress?.id === addr.id}
                                onChange={() => handleSelectSaved(addr)}
                            />
                            <div className={styles.address_info}>
                                <div className={styles.header}>
                                    <strong>{addr.name}</strong> <span className={styles.phone}>({addr.phone})</span>
                                    {addr.isDefault && <span className={styles.default_badge}>기본 배송지</span>}
                                </div>
                                <div className={styles.address_lines}>
                                    <p><strong>우편번호:</strong> {addr.zipCode}</p>
                                    <p><strong>주소:</strong> {addr.main}</p>
                                    {addr.detail && <p><strong>상세:</strong> {addr.detail}</p>}
                                </div>
                            </div>
                        </label>

                        <div className={styles.button_group}>
                            {!addr.isDefault && (
                                <button onClick={() => handleSetDefault(addr.id)}>기본으로</button>
                            )}
                            <button onClick={() => handleEdit(addr)}>수정</button>
                            <button onClick={() => handleDelete(addr.id)}>삭제</button>
                        </div>
                    </div>
                ))}

                <button className={styles.search_btn} onClick={handleSearch}>+ 새 주소 검색</button>

                {step === 'form' && (
                    <div className={styles.form}>
                        <p className={styles.address_display}><strong>주소:</strong> {fullAddress}</p>

                        <input
                            type="text"
                            placeholder="받는 분 이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />

                        <input
                            type="tel"
                            placeholder="연락처 (010-1234-5678)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={styles.input}
                        />

                        <input
                            type="text"
                            placeholder="상세주소"
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                            className={styles.input}
                        />

                        <button className={styles.save_btn} onClick={handleSubmit}>저장</button>
                    </div>
                )}


            </div>
        </div>
    )
}
