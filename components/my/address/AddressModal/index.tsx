'use client';

import Text from '@/components/common/Text';
import styles from './addressModal.module.scss';
import Input from '../Input';
import Flex from '@/components/common/Flex';
import BackArrow from '@/public/icons/back_arrow.svg';
import Image from 'next/image';
import Checkbox from '@/components/common/Checkbox';
import { useEffect, useState } from 'react';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import CloseLarge from '@/public/icons/close_large.svg';
import Toast from '@/components/common/Toast';
import { IAddress } from '@/types/address';

interface IProps {
  open?: boolean;
  addressInfo: IAddress;
  modalType?: 'default' | 'change' | 'add';
  setOpen: (status: boolean) => void;
  onChangeAddressInfo?: <K extends keyof IAddress>(key: K, value: IAddress[K]) => void;
  onClickSave?: (selectAddress: IAddress) => void;
}

const AddressModal = ({ addressInfo, modalType, setOpen, onChangeAddressInfo, onClickSave }: IProps) => {
  const [enterCheck, setEnterCheck] = useState(false);
  const [daumOpen, setDaumOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);

  const handleComplete = async (data: Address) => {
    onChangeAddressInfo?.('address', { main: data.address, zipCode: data.zonecode });
  };

  const handleSave = (addressInfo: IAddress) => {
    if (!addressInfo?.name) {
      setMessage('받으시는분이 입력되지 않았어요.');
      setMessageOpen(true);
      return;
    }

    if (!addressInfo?.phone) {
      setMessage('핸드폰 번호가 입력되지 않았어요.');
      setMessageOpen(true);
      return;
    }

    if (!addressInfo?.address?.main) {
      setMessage('주소가 입력되지 않았어요.');
      setMessageOpen(true);
      return;
    }

    if (!addressInfo?.detail) {
      setMessage('상세주소가 입력되지 않았어요.');
      setMessageOpen(true);
      return;
    }

    onClickSave?.(addressInfo);
  };

  useEffect(() => {
    if (messageOpen) {
      setTimeout(() => {
        setMessageOpen(false);
      }, 2000);
    }
  }, [messageOpen]);

  useEffect(() => {
    if (addressInfo?.address?.main && addressInfo?.name && addressInfo?.phone && addressInfo?.detail) {
      setEnterCheck(true);
    } else {
      setEnterCheck(false);
    }
  }, [addressInfo?.address?.main, addressInfo?.name, addressInfo?.phone, addressInfo?.detail]);

  return (
    <section className={styles.container}>
      <section className={styles.address_header}>
        <button className={styles.back_button} onClick={() => setOpen(false)}>
          <Image src={BackArrow} alt="뒤로가기" />
        </button>
        <Text size={2} weight={700} paddingTop={11} paddingBottom={11} lineHeight="28px">
          {modalType === 'add' ? '주소 추가하기' : '배송지 수정'}
        </Text>
      </section>
      <Flex paddingHorizontal={20} width="full" direction="column" gap={16}>
        <Input
          label="이름"
          labelId="name"
          placeholder="수령인의 이름"
          value={addressInfo?.name}
          onChange={(e) => onChangeAddressInfo?.('name', e.target.value)}
        />
        <Input
          label="휴대폰 번호"
          labelId="phone"
          placeholder="- 없이 입력"
          value={addressInfo?.phone}
          onChange={(e) => onChangeAddressInfo?.('phone', e.target.value)}
        />
        <div className={styles.address_search_input_wrap}>
          <Input
            label="우편 번호"
            labelId="zipCode"
            placeholder="우편 번호를 검색 하세요"
            value={addressInfo?.address?.zipCode}
            disabled
          />
          <button className={styles.button_reset} onClick={() => setDaumOpen(true)}>
            검색
          </button>
        </div>
        <Input
          label="주소"
          labelId="mainAddress"
          placeholder="우편 번호 검색 후, 자동 입력 됩니다"
          value={addressInfo?.address?.main}
          disabled
        />

        <Input
          label="상세 주소"
          labelId="detailAddress"
          placeholder="건물, 아파트, 동/호수 입력"
          value={addressInfo?.detail}
          onChange={(e) => onChangeAddressInfo?.('detail', e.target.value)}
        />
      </Flex>
      <Flex paddingHorizontal={20} align="center">
        <Checkbox
          id="defaultAddress"
          checked={addressInfo?.isDefault}
          onChangeCheckbox={(e) => onChangeAddressInfo?.('isDefault', e)}
        />
        <label htmlFor="defaultAddress">
          <Text paddingLeft={16} size={1.3}>
            기본 배송지로 설정
          </Text>
        </label>
      </Flex>
      <Flex paddingHorizontal={20}>
        <button
          className={`${styles.address_save_button} ${enterCheck && styles.active}`}
          onClick={() => handleSave(addressInfo)}
        >
          저장하기
        </button>
      </Flex>
      {messageOpen && <Toast type="error">{message}</Toast>}

      {daumOpen && (
        <div className={styles.daum_style}>
          <div className={styles.daum_header}>
            <button className={styles.close_button} onClick={() => setDaumOpen(false)}>
              <Image src={CloseLarge} alt="닫기" fill />
            </button>
          </div>
          <DaumPostcodeEmbed
            onComplete={handleComplete}
            style={{ height: '500px' }}
            onClose={() => setDaumOpen(false)}
          />
        </div>
      )}
    </section>
  );
};

export default AddressModal;
