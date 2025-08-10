'use client'

import { useEffect, useState } from 'react'
import KakaoPostCodeLoader from './KakaoPostCodeLoader'
import { formatAddressDisplay, openKakaoPostcode } from '@/utils/openKakaoPostCode'
import styles from './AddressModal.module.scss'
import requester from '@/utils/requester'

type ApiAddress = {
    id: number
    name: string
    phone: string
    zipCode: string
    main: string
    detail: string | null
    message: string | null
    isDefault?: boolean
}

export type SelectedAddress = {
    message: string
    id: number
    name: string
    phone: string
    fullAddress: string
    request: string
}

type Props = {
    onClose: () => void
    selectedAddress: SelectedAddress | null
    onChangeSelected: (addr: SelectedAddress) => void
}

export default function AddressModal({ onClose, selectedAddress, onChangeSelected }: Props) {
    const [step, setStep] = useState<'list' | 'form'>('list')
    const [savedAddresses, setSavedAddresses] = useState<ApiAddress[]>([])

    // form fields
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
    const [fullAddress, setFullAddress] = useState('') // main
    const [zipCode, setZipCode] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [detail, setDetail] = useState('') // 상세주소(= request로 쓰이던 값)

    // 주소 목록 불러오기
    useEffect(() => {
        (async () => {
            try {
                const res = await requester.get<ApiAddress[]>('/api/addresses')
                setSavedAddresses(res.data)
            } catch (e) {
                console.error('주소 목록 불러오기 실패:', e)
            }
        })()
    }, [])

    // 카카오 주소 검색
    const handleSearch = () => {
        openKakaoPostcode(({ full, zipCode }) => {
            setFullAddress(full)
            setZipCode(zipCode)
            setStep('form')
        })
    }

    // 기본 배송지 설정
    const handleSetDefault = async (id: number) => {
        try {
            await requester.patch(`/api/addresses/${id}`)
            setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
        } catch (e) {
            alert('기본 배송지 설정 실패')
        }
    }

    // 선택
    const handleSelectSaved = (addr: ApiAddress) => {
        const selected = {
            id: addr.id,
            name: addr.name,
            phone: addr.phone ?? '',
            fullAddress: formatAddressDisplay({ zipCode: addr.zipCode, main: addr.main, detail: addr.detail }), // ✅
            request: addr.message ?? '',
            message: '',
        };
        onChangeSelected(selected);
        // 성공 페이지 등에서 쓰면 세션에도 저장
        sessionStorage.setItem('selectedAddress', JSON.stringify(selected));   // ✅
        onClose();
    };

    // 수정 시작
    const handleEdit = (addr: ApiAddress) => {
        setEditingAddressId(addr.id)
        setFullAddress(addr.main)
        setZipCode(addr.zipCode)
        setName(addr.name)
        setPhone(addr.phone)
        setDetail(addr.detail ?? '')
        setStep('form')
    }

    // 삭제
    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        try {
            await requester.delete(`/api/addresses/${id}`)
            setSavedAddresses(prev => prev.filter(a => a.id !== id))
            // 삭제된 주소가 현재 선택된 주소면 선택 해제
            if (selectedAddress?.id === id) {
                onChangeSelected?.({
                    id: 0, name: '', phone: '', fullAddress: '', request: '',
                    message: ''
                })
            }
        } catch (e) {
            alert('삭제 실패')
        }
    }

    // 저장(신규/수정)
    const handleSubmit = async () => {
        if (!name || !phone || !fullAddress || !zipCode) {
            alert('모든 필드를 입력해주세요.')
            return
        }

        const payload = { name, phone, zipCode, main: fullAddress, detail };
        try {
            if (editingAddressId !== null) {
                const res = await requester.put<ApiAddress>(`/api/addresses/${editingAddressId}`, payload);
                const saved = res.data;
                setSavedAddresses(prev => prev.map(a => (a.id === saved.id ? saved : a)));
                const selected = {
                    id: saved.id,
                    name: saved.name,
                    phone: saved.phone ?? '',
                    fullAddress: formatAddressDisplay({ zipCode: saved.zipCode, main: saved.main, detail: saved.detail }), // ✅
                    request: saved.message ?? '',
                    message: '',
                };
                onChangeSelected(selected);
                sessionStorage.setItem('selectedAddress', JSON.stringify(selected)); // ✅
            } else {
                const res = await requester.post<ApiAddress>('/api/addresses', payload);
                const saved = res.data;
                setSavedAddresses(prev => [saved, ...prev]);
                const selected = {
                    id: saved.id,
                    name: saved.name,
                    phone: saved.phone ?? '',
                    fullAddress: formatAddressDisplay({ zipCode: saved.zipCode, main: saved.main, detail: saved.detail }), // ✅
                    request: saved.message ?? '',
                    message: '',
                };
                onChangeSelected(selected);
                sessionStorage.setItem('selectedAddress', JSON.stringify(selected)); // ✅
            }
            onClose();
        } catch (e) {
            console.error('주소 저장 실패:', e);
            alert('주소 저장에 실패했습니다.');
        }
    };

    return (
        <div className={styles.modal_overlay}>
            <KakaoPostCodeLoader />
            <div className={styles.modal}>
                <h3 className={styles.title}>배송지 선택</h3>
                <button className={styles.close_btn} onClick={onClose}>✕</button>

                {/* 저장된 주소 리스트 */}
                {savedAddresses.map(addr => (
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
                                    <strong>{addr.name}</strong>
                                    <span className={styles.phone}>({addr.phone})</span>
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
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            className={styles.input}
                        />

                        <button className={styles.save_btn} onClick={handleSubmit}>저장</button>
                    </div>
                )}
            </div>
        </div>
    )
}
