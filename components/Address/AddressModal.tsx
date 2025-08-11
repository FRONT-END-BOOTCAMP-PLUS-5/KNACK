'use client'

import { useEffect, useState } from 'react'
import styles from './AddressModal.module.scss'
import KakaoPostCodeLoader from './KakaoPostCodeLoader'
import requester from '@/utils/requester'
import { formatAddressDisplay, formatPhoneNumber, openKakaoPostcode, phonePattern } from '@/utils/openKakaoPostCode'
import Image from 'next/image'
import { AddressAddModal } from './AddressAddModal'

export type ApiAddress = {
    id: number; name: string; phone: string;
    zipCode: string; main: string; detail: string | null;
    message: string | null; isDefault?: boolean
}
export type SelectedAddress = {
    id: number; name: string; phone: string;
    fullAddress: string; request: string; message: string
}

interface AddressModalProps {
    onClose: () => void
    selectedAddress: SelectedAddress | null
    onChangeSelected: (addr: SelectedAddress) => void
    onOpenCreate?: (initial?: Partial<ApiAddress>) => void
}

export default function AddressModal({
    onClose, selectedAddress, onChangeSelected, onOpenCreate,
}: AddressModalProps) {
    const [saved, setSaved] = useState<ApiAddress[]>([])
    const selectedId = selectedAddress?.id ?? 0
    // 상단 state 추가
    const [openAddModal, setOpenAddModal] = useState(false)
    const [editing, setEditing] = useState<ApiAddress | null>(null)
    const [initial, setInitial] = useState<Partial<ApiAddress> | null>(null)

    // 주소 목록 로드 함수 분리 (재사용)
    const loadAddresses = async () => {
        try {
            const res = await requester.get<ApiAddress[]>('/api/addresses')
            const list = [...res.data].sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault))
            setSaved(list)
        } catch (e) {
            console.error('주소 목록 불러오기 실패:', e)
        }
    }

    useEffect(() => {
        loadAddresses()
    }, [])


    useEffect(() => {
        (async () => {
            try {
                const res = await requester.get<ApiAddress[]>('/api/addresses')
                const list = [...res.data].sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault))
                setSaved(list)
            } catch (e) {
                console.error('주소 목록 불러오기 실패:', e)
            }
        })()
    }, [])

    const handleSelect = (addr: ApiAddress) => {
        const sel: SelectedAddress = {
            id: addr.id,
            name: addr.name,
            phone: addr.phone ?? '',
            fullAddress: formatAddressDisplay({ zipCode: addr.zipCode, main: addr.main, detail: addr.detail }),
            request: addr.message ?? '',
            message: '',
        }
        onChangeSelected(sel)
        sessionStorage.setItem('selectedAddress', JSON.stringify(sel))
        onClose()
    }

    const setDefault = async (id: number) => {
        try {
            await requester.patch(`/api/addresses/${id}`)
            setSaved(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
        } catch {
            alert('기본 배송지 설정 실패')
        }
    }

    const edit = (addr: ApiAddress) => {
        setEditing(addr)
        setInitial(null)
        setOpenAddModal(true)
    }

    const remove = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        try {
            await requester.delete(`/api/addresses/${id}`)
            setSaved(prev => prev.filter(a => a.id !== id))
            if (selectedId === id) {
                onChangeSelected({ id: 0, name: '', phone: '', fullAddress: '', request: '', message: '' })
            }
        } catch {
            alert('삭제 실패')
        }
    }

    const openSearchAndCreate = () => {
        setEditing(null)
        setOpenAddModal(true)
    }

    // 키보드로도 선택 가능
    const keySelect =
        (addr: ApiAddress) =>
            (e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(addr)
                }
            }

    return (
        <div className={styles.modal_overlay}>
            <KakaoPostCodeLoader />
            <div className={styles.modal} role="dialog" aria-modal="true">
                <header className={styles.header_bar}>
                    <h2 className={styles.title}>주소록</h2>
                    <button aria-label="닫기" className={styles.icon_btn} onClick={onClose}>✕</button>
                </header>

                <button className={styles.primary_outline_btn} onClick={openSearchAndCreate}>
                    + 새 주소 추가하기
                </button>

                <ul className={styles.list}>
                    {saved.map(addr => {
                        const isSelected = selectedId === addr.id
                        return (
                            <li key={addr.id} className={styles.item_row}>
                                <div
                                    className={`${styles.item_button} ${isSelected ? styles.selected : ''}`}
                                    onClick={() => handleSelect(addr)}
                                    onKeyDown={keySelect(addr)}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isSelected}
                                >
                                    {/* 우측 상단 액션 버튼 */}
                                    <div className={styles.item_actions} onClick={(e) => e.stopPropagation()}>
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            className={styles.text_btn}
                                            onClick={() => edit(addr)}
                                            onKeyDown={(e) => e.key === 'Enter' && edit(addr)}
                                        >
                                            <Image src="/icons/modify.svg" alt="수정" width={16} height={16} />
                                        </span>
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            className={styles.text_btn}
                                            onClick={() => remove(addr.id)}
                                            onKeyDown={(e) => e.key === 'Enter' && remove(addr.id)}
                                        >
                                            <Image src="/icons/delete.svg" alt="삭제" width={16} height={16} />
                                        </span>
                                    </div>

                                    {/* 주소 정보 */}
                                    <div className={styles.info_box}>
                                        <div className={styles.name_line}>
                                            <span className={styles.name}>{addr.name}</span>
                                            {addr.isDefault && <span className={styles.badge}>기본 배송지</span>}
                                        </div>
                                        <div className={styles.addr_text}>
                                            ({addr.zipCode}) {addr.main}{addr.detail ? ` ${addr.detail}` : ''}
                                        </div>
                                        <div className={styles.phone_text}>
                                            {phonePattern.test(addr.phone) ? formatPhoneNumber(addr.phone) : addr.phone}
                                        </div>
                                    </div>

                                    {isSelected && <span className={styles.checkmark}>✓</span>}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {openAddModal && (
                <AddressAddModal
                    editing={editing}                 // 있으면 수정, 없으면 신규
                    onClose={() => setOpenAddModal(false)}  // 부모(AddressModal)는 유지, 자식만 닫기
                    onSaved={async (selectedAddr) => {
                        // 저장 성공 시 목록 리프레시
                        await loadAddresses();

                        // 방금 저장/수정한 주소를 선택 상태로 반영 (부모는 그대로 유지)
                        onChangeSelected(selectedAddr);

                        setOpenAddModal(false);
                    }}
                />
            )}
        </div>
    )
}
