'use client';

import Text from '@/components/common/Text';
import styles from './addressModal.module.scss';
import Input from '../Input';
import Flex from '@/components/common/Flex';
import BackArrow from '@/public/icons/back_arrow.svg';
import Image from 'next/image';
import Checkbox from '@/components/common/Checkbox';
import { useState } from 'react';

interface IProps {
  open?: boolean;
  setOpen: (status: boolean) => void;
}

const AddressModal = ({ setOpen }: IProps) => {
  const [enterCheck, setEnterCheck] = useState(false);

  return (
    <section className={styles.container}>
      <section className={styles.address_header}>
        <button className={styles.back_button} onClick={() => setOpen(false)}>
          <Image src={BackArrow} alt="뒤로가기" />
        </button>
        <Text size={2} weight={700} paddingTop={11} paddingBottom={11} lineHeight="28px">
          주소 추가하기
        </Text>
      </section>
      <Flex paddingHorizontal={20} width="full" direction="column" gap={16}>
        <Input label="이름" labelId="name" placeholder="수령인의 이름" />
        <Input label="휴대폰 번호" labelId="phone" placeholder="- 없이 입력" />
        <Input label="우편 번호" labelId="zipCode" placeholder="우편 번호를 검색 하세요" />
        <Input label="주소" labelId="address" placeholder="우편 번호 검색 후, 자동 입력 됩니다" />
        <Input label="상세 주소" labelId="detailAddress" placeholder="건물, 아파트, 동/호수 입력" />
      </Flex>
      <Flex paddingHorizontal={20} align="center">
        <Checkbox id="defaultAddress" />
        <label htmlFor="defaultAddress">
          <Text paddingLeft={16} size={1.3}>
            기본 배송지로 설정
          </Text>
        </label>
      </Flex>
      <Flex paddingHorizontal={20}>
        <button className={`${styles.address_save_button} ${enterCheck && styles.active}`}>저장하기</button>
      </Flex>
    </section>
  );
};

export default AddressModal;
