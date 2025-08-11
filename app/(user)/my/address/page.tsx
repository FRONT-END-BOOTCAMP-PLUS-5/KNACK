'use client';

import Flex from '@/components/common/Flex';
import styles from './addressPage.module.scss';
import Text from '@/components/common/Text';
import { useState } from 'react';
import AddressModal from '@/components/my/address/AddressModal';

const AddressPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.container}>
      <button className={styles.address_add_button} onClick={() => setOpen(true)}>
        <Text size={1.6}>+ 새 주소 추가하기</Text>
      </button>
      <Flex className={styles.address_info} direction="column" paddingVertical={16}>
        <Flex align="center">
          <Text size={1.5} weight={700}>
            장도영
          </Text>
          <Text
            className={styles.address_badge}
            size={1.2}
            paddingLeft={6}
            paddingRight={6}
            paddingBottom={3}
            paddingTop={3}
            marginLeft={4}
          >
            기본 배송지
          </Text>
        </Flex>
        <Text size={1.5} paddingTop={6}>
          01038250313
        </Text>
        <Text size={1.4} paddingTop={6}>
          (04946) 서울 광진구 영화사로 3길 20-8 (중곡동) 202호
        </Text>
        <div className={styles.button_wrap}>
          <button className={styles.text_button}>수정</button>
          <button className={`${styles.text_button} ${styles.border_before}`}>삭제</button>
        </div>
      </Flex>
      <Flex direction="column" className={styles.address_list} marginVertical={16}>
        <Flex direction="column">
          <Text size={1.5} weight={700}>
            장도영
          </Text>
          <Text paddingTop={6} size={1.5}>
            01038250313
          </Text>
          <Text paddingTop={6} size={1.4}>
            (04946) 서울 광진구 영화사로 3길 20-8 (중곡동) 202호
          </Text>
        </Flex>
        <div className={styles.border_button_wrap}>
          <button className={styles.border_button}>기본 배송지</button>
          <button className={`${styles.border_button} ${styles.border_left}`}>수정</button>
          <button className={`${styles.border_button} ${styles.border_left}`}>삭제</button>
        </div>
      </Flex>

      {open && <AddressModal setOpen={setOpen} />}
    </section>
  );
};

export default AddressPage;
