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

    const handleSelect = (id: number) => {
        const addr = addresses.find((a) => a.id === id)
        if (!addr) return
        setSelectedAddress({
            id: addr.id,
            name: addr.name,
            phone: addr.phone ?? '',
            fullAddress: `${addr.main} ${addr.detail ?? ''}`.trim(),
            request: addr.message ?? '',
        })
    }

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
                            <div><span className={styles.label}>요청사항</span> {selectedAddress.request || '없음'}</div>
                        </div>
                    ) : (
                        <p className={styles.no_address}>주소가 선택되지 않았습니다.</p>
                    )}

                    <div className={styles.address_list}>
                        {addresses.map((addr) => (
                            <label key={addr.id} className={styles.address_item}>
                                <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddress?.id === addr.id}
                                    onChange={() => handleSelect(addr.id)}
                                    className={styles.radio}
                                />
                                <div className={styles.address_text}>
                                    <strong>{addr.isDefault ? '[기본] ' : ''}{addr.name}</strong>
                                    <div className={styles.sub_text}>{addr.main} {addr.detail}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </>
            )}

            {open && <AddressModal onClose={() => setOpen(false)} />}
        </div>
    )
}
