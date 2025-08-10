'use client';

import styles from './profilePage.module.scss';
import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import Switch from '@/components/common/Switch';
import { useState } from 'react';

const ProfilePage = () => {
  const [privacyOn, setPrivacyOn] = useState(false);
  const [smsOn, setSmsOn] = useState(false);
  const [emailOn, setEmailOn] = useState(false);

  return (
    <section className={styles.my_profile_wrap}>
      <Text size={1.8} weight={700}>
        내 계정
      </Text>
      <Flex direction="column" className={styles.profile_info} paddingVertical={12}>
        <Text size={1.3} color="gray2">
          이메일 주소
        </Text>
        <Text size={1.6} weight={500} paddingTop={8} paddingBottom={8}>
          wkd*****@naver.com
        </Text>
      </Flex>
      <Flex direction="column" className={styles.profile_info} paddingVertical={12}>
        <Text size={1.3} color="gray2">
          비밀번호
        </Text>
        <Text size={1.6} weight={500} paddingTop={8} paddingBottom={8}>
          *********
        </Text>
      </Flex>
      <section className={styles.profile_group}>
        <Text size={1.8} weight={700}>
          개인 정보
        </Text>
        <Flex direction="column" className={styles.profile_info} paddingVertical={12}>
          <Text size={1.3} color="gray2">
            휴대폰 번호
          </Text>
          <Text size={1.6} weight={500} paddingTop={8} paddingBottom={8}>
            010-3***-*313
          </Text>
        </Flex>
      </section>
      <section className={styles.profile_group}>
        <Text size={1.8} weight={700}>
          광고성 정보 수신
        </Text>
        <Flex align="center" justify="between" className={styles.profile_info} paddingVertical={12}>
          <Text size={1.6}>개인 정보 수집 및 이용 동의</Text>
          <Switch isActive={privacyOn} onActive={() => setPrivacyOn(!privacyOn)} />
        </Flex>
        <Flex align="center" justify="between" className={styles.profile_info} paddingVertical={12}>
          <Text size={1.6}>문자 메시지</Text>
          <Switch isActive={smsOn} onActive={() => setSmsOn(!smsOn)} />
        </Flex>
        <Flex align="center" justify="between" className={styles.profile_info} paddingVertical={12}>
          <Text size={1.6}>이메일</Text>
          <Switch isActive={emailOn} onActive={() => setEmailOn(!emailOn)} />
        </Flex>
      </section>
    </section>
  );
};

export default ProfilePage;
