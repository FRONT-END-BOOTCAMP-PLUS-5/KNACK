'use client'

import { useEffect, useState } from 'react'
import { useAddressStore } from '@/store/useAddressStore'
import AddressModal from './AddressModal'
import styles from './AddressBox.module.scss'

// AddressBox.tsx

export default function AddressBox() {
    const { selectedAddress, setSelectedAddress } = useAddressStore()
    const [open, setOpen] = useState(false)
    const [request, setRequest] = useState('')

    useEffect(() => {
        if (selectedAddress?.request) {
            setRequest(selectedAddress.request)
        } else {
            setRequest('')
        }
    }, [selectedAddress])

    return (
        <div className={styles.address_box}>
            <div className={styles.header}>
                <span className={styles.title}>배송 주소</span>
                <button className={styles.change_btn} onClick={() => setOpen(true)}>주소 변경</button>
            </div>

            {selectedAddress ? (
                <div className={styles.info_box}>
                    <div><span className={styles.label}>받는 분</span> {selectedAddress.name}</div>
                    <div><span className={styles.label}>연락처</span> {selectedAddress.phone}</div>
                    <div><span className={styles.label}>주소</span> {selectedAddress.fullAddress}</div>
                    <div className={styles.select_box}>
                        <select
                            className={styles.select}
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                        >
                            <option value="">요청사항 없음</option>
                            <option value="문 앞에 두고 벨 눌러주세요">문 앞에 두고 벨 눌러주세요</option>
                            <option value="배송 전 연락 부탁드립니다">배송 전 연락 부탁드립니다</option>
                            <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                            <option value="직접 입력">직접 입력</option>
                        </select>

                        {request === '직접 입력' && (
                            <input
                                type="text"
                                placeholder="요청사항을 입력해주세요"
                                className={styles.input}
                                onChange={(e) => setRequest(e.target.value)}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <p className={styles.no_address}>주소가 선택되지 않았습니다.</p>
            )}

            {open && <AddressModal onClose={() => setOpen(false)} />}
        </div>
    )
}

