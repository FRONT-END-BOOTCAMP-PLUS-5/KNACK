'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './addressAddModal.module.scss';
import requester from '@/utils/requester';
import Image from 'next/image';
import { AddressAddModalProps } from '@/types/order';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import CloseLarge from '@/public/icons/close_large.svg';
import { IAddress } from '@/types/address';
import { useToastStore } from '@/store/toastStore';

const NAME_MIN = 2;
const NAME_MAX = 50;
const phonePattern = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;

export function AddressAddModal({ onClose, onSaved, editing, initial }: AddressAddModalProps) {
  const isEdit = !!editing;

  const { setOnToast } = useToastStore();

  const [zipCode, setZipCode] = useState(editing?.address?.zipCode ?? initial?.zipCode ?? '');
  const [main, setMain] = useState(editing?.address?.main ?? initial?.main ?? '');
  const [detail, setDetail] = useState(editing?.detail ?? '');
  const [name, setName] = useState(editing?.name ?? '');
  const [phone, setPhone] = useState(editing?.phone ?? '');
  const [setAsDefault, setSetAsDefault] = useState(!!editing?.isDefault);

  // ⬇️ 새로 추가: 우편번호 검색 모달 열림 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const nameError = useMemo(() => {
    if (!name) return '올바른 이름을 입력해주세요. (2 ~ 50자)';
    if (name.length < NAME_MIN || name.length > NAME_MAX) return '올바른 이름을 입력해주세요. (2 ~ 50자)';
    return '';
  }, [name]);

  const phoneError = useMemo(() => {
    if (!phone) return '';
    return phonePattern.test(phone) ? '' : '휴대폰 번호 형식이 올바르지 않습니다.';
  }, [phone]);

  const disabled = !name || !!nameError || !zipCode || !main || !!phoneError;

  // ⬇️ 변경: 기존 openKakaoPostcode 대신 모달 오픈 토글
  const handleSearchZip = () => {
    setIsPostcodeOpen(true);
  };

  // ⬇️ 새로 추가: Daum 주소 검색 완료 핸들러
  const handlePostcodeComplete = (data: Address) => {
    // 기본 주소: 도로명(R) / 지번(J) 구분
    const roadAddr = data.roadAddress;
    const jibunAddr = data.jibunAddress;
    let full = data.addressType === 'R' ? roadAddr : jibunAddr;

    // 참고항목(법정동/건물명) 조합
    const extras: string[] = [];
    if (data.bname) extras.push(data.bname);
    if (data.buildingName) extras.push(data.buildingName);
    if (extras.length) full += ` (${extras.join(', ')})`;

    setZipCode(data.zonecode); // 5자리 우편번호
    setMain(full);
    setIsPostcodeOpen(false);
  };

  const handleSave = async () => {
    const payload = { name, phone, zipCode, main, detail };

    try {
      let saved: IAddress;
      if (isEdit && editing) {
        const res = await requester.put<IAddress>(`/api/addresses/${editing.id}`, payload);
        saved = { ...res.data, id: editing.id };
      } else {
        const res = await requester.post<IAddress>('/api/addresses', { ...payload });
        saved = res.data;
      }

      // 기본배송지 설정이 필요한 경우에만 PATCH
      const needSetDefault = setAsDefault && !saved.isDefault;
      if (needSetDefault) {
        await requester.patch(`/api/addresses/${saved.id}`);
      }

      const selected: IAddress = {
        id: saved.id,
        name: saved.name,
        phone: saved.phone ?? '',
        detail: saved.detail ?? '',
        isDefault: saved.isDefault,
        message: saved.message ?? '',
        address: {
          zipCode: saved.address.zipCode,
          main: saved.address.main,
        },
      };
      sessionStorage.setItem('IAddress', JSON.stringify(selected));
      onSaved?.(selected);
      onClose();
    } catch (e) {
      console.error(e);
      setOnToast(true, '주소 저장에 실패했어요.');
    }
  };

  // editing/initial이 바뀌어도 폼이 갱신되도록
  useEffect(() => {
    setZipCode(editing?.address.zipCode ?? initial?.zipCode ?? '');
    setMain(editing?.address.main ?? initial?.main ?? '');
    setDetail(editing?.detail ?? '');
    setName(editing?.name ?? '');
    setPhone(editing?.phone ?? '');
    setSetAsDefault(!!editing?.isDefault);
  }, [editing, initial]);

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header_bar2}>
          <button className={styles.icon_btn} onClick={onClose} aria-label="뒤로">
            <Image src="/icons/header-back.svg" alt="뒤로가기" width={24} height={24} />
          </button>
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
              onChange={(e) => setName(e.target.value)}
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
            <button className={styles.ghost_btn} onClick={handleSearchZip}>
              우편번호
            </button>
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
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          <label className={styles.checkbox_row}>
            <input type="checkbox" checked={setAsDefault} onChange={(e) => setSetAsDefault(e.target.checked)} />
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

      {/* ⬇️ 새로 추가: 우편번호 검색 모달 */}
      {isPostcodeOpen && (
        <div
          className={styles.daum_style}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPostcodeOpen(false); // 바깥 클릭 닫기
          }}
        >
          <div className={styles.daum_header}>
            <button className={styles.close_button} onClick={() => setIsPostcodeOpen(false)}>
              <Image src={CloseLarge} alt="닫기" fill />
            </button>
          </div>
          <DaumPostcodeEmbed
            onComplete={handlePostcodeComplete}
            style={{ width: '100%', height: 480 }} // 필요시 조정
          />
        </div>
      )}
    </div>
  );
}
