'use client'

import { useEffect, useState } from 'react'
import styles from './AddressBox.module.scss'

type SelectedAddress = {
    id: number
    name: string
    phone?: string
    fullAddress: string
    request?: string
}

type Props = {
    selectedAddress: SelectedAddress | null
    onOpenModal: () => void
    onChangeRequest: (request: string) => void
}

export default function AddressBox({
    selectedAddress,
    onOpenModal,
    onChangeRequest,
}: Props) {
    const [request, setRequest] = useState<string>('')

    useEffect(() => {
        setRequest(selectedAddress?.request ?? '')
    }, [selectedAddress])

    const handleSelectChange = (v: string) => {
        // "직접 입력"은 입력창 보여주고 값은 아직 비움
        if (v !== '직접 입력') {
            setRequest(v)
            onChangeRequest(v)
        } else {
            setRequest('직접 입력')
        }
    }

    const showCustomInput = request === '직접 입력'

    return (
        <div className={styles.address_box}>
            <div className={styles.header}>
                <span className={styles.title}>배송 주소</span>
                <button className={styles.change_btn} onClick={onOpenModal}>주소 변경</button>
            </div>

            {selectedAddress ? (
                <div className={styles.info_box}>
                    <div><span className={styles.label}>받는 분</span> {selectedAddress.name}</div>
                    <div><span className={styles.label}>연락처</span> {selectedAddress.phone}</div>
                    <div><span className={styles.label}>주소</span> {selectedAddress.fullAddress}</div>

                    <div className={styles.select_box}>
                        <select
                            className={styles.select}
                            value={showCustomInput ? '직접 입력' : (request || '')}
                            onChange={(e) => handleSelectChange(e.target.value)}
                        >
                            <option value="">요청사항 없음</option>
                            <option value="문 앞에 두고 벨 눌러주세요">문 앞에 두고 벨 눌러주세요</option>
                            <option value="배송 전 연락 부탁드립니다">배송 전 연락 부탁드립니다</option>
                            <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                            <option value="직접 입력">직접 입력</option>
                        </select>

                        {showCustomInput && (
                            <input
                                type="text"
                                placeholder="요청사항을 입력해주세요"
                                className={styles.input}
                                value={request === '직접 입력' ? '' : request}
                                onChange={(e) => {
                                    const val = e.target.value
                                    setRequest(val)
                                    onChangeRequest(val)
                                }}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <p className={styles.no_address}>주소가 선택되지 않았습니다.</p>
            )}
        </div>
    )
}
