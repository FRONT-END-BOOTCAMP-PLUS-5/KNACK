'use client'

import { useEffect, useState } from 'react'
import { useAddressStore } from '@/store/useAddressStore'
import AddressModal from './AddressModal'
import styles from './AddressBox.module.scss'
import requester from '@/utils/requester'
import { AddressDto } from '@/backend/address/applications/dtos/AddressDto'

export default function AddressBox() {
    const { selectedAddress, setSelectedAddress } = useAddressStore()
    const [addresses, setAddresses] = useState<AddressDto[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [request, setRequest] = useState('')

    useEffect(() => {
        requester.get('/api/addresses')
            .then((data) => {
                setAddresses(data.data)
                const defaultAddr = data.data.find((addr: AddressDto) => addr.isDefault)
                if (defaultAddr) {
                    setSelectedAddress({
                        id: defaultAddr.id,
                        name: defaultAddr.name,
                        phone: defaultAddr.phone ?? '',
                        fullAddress: `${defaultAddr.main} ${defaultAddr.detail ?? ''}`.trim(),
                        request: defaultAddr.message ?? '',
                    })
                }
            })
            .finally(() => setLoading(false))
    }, [])

    // ✅ selectedAddress가 변경될 때 request 동기화
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

            {loading ? (
                <p className={styles.loading}>주소 로딩 중...</p>
            ) : (
                <>
                    {selectedAddress ? (
                        <div className={styles.info_box}>
                            <div><span className={styles.label}>받는 분</span> {selectedAddress.name}</div>
                            <div><span className={styles.label}>연락처</span> {selectedAddress.phone}</div>
                            <div><span className={styles.label}>주소</span> {selectedAddress.fullAddress}</div>
                            <div className={styles.select_box}><select
                                className={styles.select}
                                value={request}
                                onChange={(e) => setRequest(e.target.value)}
                            >
                                <option value="">요청사항 선택</option>
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
                                )}</div>
                        </div>
                    ) : (
                        <p className={styles.no_address}>주소가 선택되지 않았습니다.</p>
                    )}
                </>
            )}

            {open && <AddressModal onClose={() => setOpen(false)} />}
        </div>
    )
}
