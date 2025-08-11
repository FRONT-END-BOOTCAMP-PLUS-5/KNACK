'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './AddressModal.module.scss'
import KakaoPostCodeLoader from './KakaoPostCodeLoader'
import requester from '@/utils/requester'
import { formatAddressDisplay, openKakaoPostcode } from '@/utils/openKakaoPostCode'
import type { ApiAddress, SelectedAddress } from './AddressModal'
import Image from 'next/image'

interface AddressAddModalProps {
    onClose: () => void
    onSaved?: (addr: SelectedAddress) => void
    editing?: ApiAddress | null
    /** 신규 등록 시 카카오 검색에서 넘겨줄 초기값 (선택) */
    initial?: Partial<Pick<ApiAddress, 'zipCode' | 'main'>>
}

const NAME_MIN = 2
const NAME_MAX = 50
const phonePattern = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/

export function AddressAddModal({ onClose, onSaved, editing, initial }: AddressAddModalProps) {
    const isEdit = !!editing

    const [zipCode, setZipCode] = useState(editing?.zipCode ?? initial?.zipCode ?? '')
    const [main, setMain] = useState(editing?.main ?? initial?.main ?? '')
    const [detail, setDetail] = useState(editing?.detail ?? '')
    const [name, setName] = useState(editing?.name ?? '')
    const [phone, setPhone] = useState(editing?.phone ?? '')
    const [setAsDefault, setSetAsDefault] = useState(!!editing?.isDefault)

    // editing/initial이 바뀌어도 폼이 갱신되도록
    useEffect(() => {
        setZipCode(editing?.zipCode ?? initial?.zipCode ?? '')
        setMain(editing?.main ?? initial?.main ?? '')
        setDetail(editing?.detail ?? '')
        setName(editing?.name ?? '')
        setPhone(editing?.phone ?? '')
        setSetAsDefault(!!editing?.isDefault)
    }, [editing, initial])

    const nameError = useMemo(() => {
        if (!name) return '올바른 이름을 입력해주세요. (2 ~ 50자)'
        if (name.length < NAME_MIN || name.length > NAME_MAX) return '올바른 이름을 입력해주세요. (2 ~ 50자)'
        return ''
    }, [name])

    const phoneError = useMemo(() => {
        if (!phone) return '';
        return phonePattern.test(phone) ? '' : '휴대폰 번호 형식이 올바르지 않습니다.';
    }, [phone]);

    const disabled = !name || !!nameError || !zipCode || !main || !!phoneError

    const handleSearchZip = () => {
        openKakaoPostcode(({ full, zipCode }) => {
            setMain(full)
            setZipCode(zipCode)
        })
    }

    const handleSave = async () => {
        const payload = { name, phone, zipCode, main, detail }

        try {
            let saved: ApiAddress
            if (isEdit && editing) {
                const res = await requester.put<ApiAddress>(`/api/addresses/${editing.id}`, payload)
                console.log(res);
                saved = { ...res.data, id: editing.id }
            } else {
                const res = await requester.post<ApiAddress>('/api/addresses', { ...payload })
                saved = res.data
            }

            // 기본배송지 설정이 필요한 경우에만 PATCH
            const needSetDefault = setAsDefault && !saved.isDefault
            if (needSetDefault) {
                await requester.patch(`/api/addresses/${saved.id}`)
            }

            const selected: SelectedAddress = {
                id: saved.id,
                name: saved.name,
                phone: saved.phone ?? '',
                fullAddress: formatAddressDisplay({ zipCode: saved.zipCode, main: saved.main, detail: saved.detail }),
                request: saved.message ?? '',
                message: '',
            }
            sessionStorage.setItem('selectedAddress', JSON.stringify(selected))
            onSaved?.(selected)
            onClose()
        } catch (e) {
            console.error(e)
            alert('주소 저장에 실패했습니다.')
        }
    }

    return (
        <div className={styles.modal_overlay}>
            <KakaoPostCodeLoader />
            <div className={styles.modal} role="dialog" aria-modal="true">
                <header className={styles.header_bar2}>
                    <button className={styles.icon_btn} onClick={onClose} aria-label="뒤로"><Image src="/icons/header-back.svg" alt="뒤로가기" width={24} height={24} /></button>
                    <h3 className={styles.title}>{isEdit ? '주소 수정하기' : '주소 추가하기'}</h3>
                    <span />
                </header>

                <div className={styles.form_box}>
                    <div className={styles.form_row}>
                        <label>이름</label>
                        <input
                            type="text"
                            placeholder="수령인의 이름"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={NAME_MAX}
                        />
                        {nameError && <p className={styles.error}>{nameError}</p>}
                    </div>

                    <div className={styles.form_row}>
                        <label>휴대폰 번호</label>
                        <input
                            type="tel"
                            placeholder="- 없이 입력"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        />
                        {phoneError && <p className={styles.error}>{phoneError}</p>}
                    </div>

                    <div className={styles.form_row_inline}>
                        <div className={styles.flex1}>
                            <label>우편번호</label>
                            <input type="text" placeholder="우편 번호를 검색하세요" value={zipCode} readOnly />
                        </div>
                        <button className={styles.ghost_btn} onClick={handleSearchZip}>우편번호</button>
                    </div>

                    <div className={styles.form_row}>
                        <label>주소</label>
                        <input type="text" placeholder="우편 번호 검색 후, 자동입력 됩니다" value={main} readOnly />
                    </div>

                    <div className={styles.form_row}>
                        <label>상세 주소</label>
                        <input
                            type="text"
                            placeholder="건물, 아파트, 동/호수 입력"
                            value={detail ?? ''}
                            onChange={e => setDetail(e.target.value)}
                        />
                    </div>

                    <label className={styles.checkbox_row}>
                        <input
                            type="checkbox"
                            checked={setAsDefault}
                            onChange={e => setSetAsDefault(e.target.checked)}
                        />
                        기본 배송지로 설정
                    </label>

                    <button
                        className={disabled ? styles.primary_btn_disabled : styles.primary_btn}
                        disabled={disabled}
                        onClick={handleSave}
                    >
                        저장하기
                    </button>
                </div>
            </div>
        </div>
    )
}
