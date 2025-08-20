'use client'

import { useEffect, useState } from 'react'
import styles from './addressBox.module.scss'
import { formatPhoneNumber, phonePattern } from '@/utils/formatAddressUtils'
import { AddressBoxProps } from '@/types/order'

export default function AddressBox({
    IAddress,
    onOpenModal,
    onOpenRequestModal,
    onChangeRequest,
}: AddressBoxProps) {
    const [request, setRequest] = useState<string>('')

    useEffect(() => {
        setRequest(IAddress?.request ?? '')
    }, [IAddress])

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
                {IAddress ? (
                    <>
                        <div className={styles.table}>
                            <div className={styles.label}><p>받는 분</p></div>
                            <div className={styles.value}>{IAddress.name}</div>

                            <div className={styles.label}><p>연락처</p></div>
                            <div className={styles.value}>{IAddress.phone && phonePattern.test(IAddress.phone) ? formatPhoneNumber(IAddress.phone) : IAddress.phone || '-'}</div>

                            <div className={styles.label}><p>주소</p></div>
                            <div className={styles.value}>{IAddress.fullAddress}</div>
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
