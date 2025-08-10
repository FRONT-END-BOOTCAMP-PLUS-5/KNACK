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
    onOpenRequestModal?: () => void;
    onChangeRequest: (request: string) => void
}

export default function AddressBox({
    selectedAddress,
    onOpenModal,
    onOpenRequestModal,
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
        <div className={styles.container}>
            <div className={styles.section_divider} />

            <div className={styles.address_box}>
                <div className={styles.div_20px} />
                <div className={styles.header}>
                    <p className={styles.title}>배송 주소</p>
                    <button className={styles.change_btn} onClick={onOpenModal}><p className={styles.text_lookup}>주소 변경</p></button>
                </div>
                <div className={styles.div_8px} />
                {selectedAddress ? (
                    <>
                        <div className={styles.table}>
                            <div className={styles.label}><p>받는 분</p></div>
                            <div className={styles.value}>{selectedAddress.name}</div>

                            <div className={styles.label}><p>연락처</p></div>
                            <div className={styles.value}>{selectedAddress.phone}</div>

                            <div className={styles.label}><p>주소</p></div>
                            <div className={styles.value}>{selectedAddress.fullAddress}</div>
                        </div>

                        <div className={styles.request_row} onClick={onOpenRequestModal}>
                            <span className={styles.request_text}>{request || '요청사항 없음'}</span>
                            <span className={styles.chevron} aria-hidden="true" />
                        </div>
                    </>
                ) : (
                    <p className={styles.no_address}>주소가 선택되지 않았습니다.</p>
                )}
            </div>

            {/* 아래쪽 회색 선 */}
            <div className={styles.section_divider} />
        </div>
    )
}
