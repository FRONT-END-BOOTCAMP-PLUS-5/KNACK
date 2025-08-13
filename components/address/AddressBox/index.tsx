'use client'

import { useEffect, useState } from 'react'
import styles from './addressBox.module.scss'
import { formatPhoneNumber, phonePattern } from '@/utils/openKakaoPostCode'
import { AddressBoxProps } from '@/types/order'

export default function AddressBox({
    selectedAddress,
    onOpenModal,
    onOpenRequestModal,
    onChangeRequest,
}: AddressBoxProps) {
    const [request, setRequest] = useState<string>('')

    useEffect(() => {
        setRequest(selectedAddress?.request ?? '')
    }, [selectedAddress])

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
                            <div className={styles.value}>{selectedAddress.phone && phonePattern.test(selectedAddress.phone) ? formatPhoneNumber(selectedAddress.phone) : selectedAddress.phone || '-'}</div>

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
