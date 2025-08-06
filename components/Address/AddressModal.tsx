'use client'

import { useEffect, useState } from 'react'
import { useAddressStore } from '@/store/useAddressStore'
import KakaoPostCodeLoader from './KakaoPostCodeLoader'
import { openKakaoPostcode } from '@/utils/openKakaoPostCode'
import styles from './AddressModal.module.scss'

interface Address {
    id: number
    name: string
    phone: string
    fullAddress: string
    request: string
}

interface Props {
    onClose: () => void
}

export default function AddressModal({ onClose }: Props) {
    const setSelectedAddress = useAddressStore((state) => state.setSelectedAddress)

    const [step, setStep] = useState<'list' | 'form'>('list')
    const [fullAddress, setFullAddress] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [request, setRequest] = useState('')
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([])

    const handleSearch = () => {
        openKakaoPostcode((addr) => {
            setFullAddress(addr)
            setStep('form')
        })
    }

    const handleSubmit = () => {
        if (!name || !phone || !fullAddress) {
            alert('모든 필드를 입력해주세요.')
            return
        }

        const newAddress = {
            id: Date.now(),
            name,
            phone,
            fullAddress,
            request,
        }

        setSelectedAddress(newAddress)
        onClose()
    }

    const handleSelectSaved = (addr: Address) => {
        setSelectedAddress(addr)
        onClose()
    }

    return (
        <div className={styles.modal_overlay}>
            <KakaoPostCodeLoader />
            <div className={styles.modal}>
                <h3>배송지 선택</h3>

                {step === 'list' && (
                    <>
                        {savedAddresses.length > 0 && (
                            <div className={styles.saved_list}>
                                {savedAddresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={styles.saved_item}
                                        onClick={() => handleSelectSaved(addr)}
                                    >
                                        <p><strong>{addr.name}</strong> ({addr.phone})</p>
                                        <p>{addr.fullAddress}</p>
                                        <p className={styles.request}>{addr.request || '요청사항 없음'}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button className={styles.search_btn} onClick={handleSearch}>+ 새 주소 검색</button>
                    </>
                )}

                {step === 'form' && (
                    <div className={styles.form}>
                        <p className={styles.address_display}><strong>주소:</strong> {fullAddress}</p>

                        <input
                            type="text"
                            placeholder="받는 분 이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="tel"
                            placeholder="연락처 (010-1234-5678)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="요청사항 (선택)"
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                        />

                        <button className={styles.save_btn} onClick={handleSubmit}>저장</button>
                    </div>
                )}

                <button className={styles.close_btn} onClick={onClose}>닫기</button>
            </div>
        </div>
    )
}
