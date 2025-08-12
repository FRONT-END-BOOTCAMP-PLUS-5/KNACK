'use client';

import styles from './profilePage.module.scss';
import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import Switch from '@/components/common/Switch';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { myService } from '@/services/my';
import { IUpdateUserRef } from '@/types/user';

interface IMarketing {
  sns: boolean;
  privacy: boolean;
}

const ProfilePage = () => {
  const [marketing, setMarketing] = useState<IMarketing>({ sns: false, privacy: false });

  const { user } = useUserStore();
  const { updateUser } = myService;

  const handleUpdateUser = (data: IUpdateUserRef) => {
    updateUser(data)
      .then((res) => {
        console.log('res', res);
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  const updateMarketing = (value: boolean) => {
    setMarketing({ ...marketing, privacy: value });

    const data: IUpdateUserRef = {
      marketing: value,
      sns: user?.sns,
      name: user?.name,
      nickname: user?.nickname,
      profileImage: user?.profileImage ?? '',
    };

    handleUpdateUser(data);
  };

  const updateSms = (value: boolean) => {
    setMarketing({ ...marketing, sns: value });

    const data: IUpdateUserRef = {
      marketing: user?.marketing,
      sns: value,
      name: user?.name,
      nickname: user?.nickname,
      profileImage: user?.profileImage ?? '',
    };

    handleUpdateUser(data);
  };

  useEffect(() => {
    if (user) {
      setMarketing({ privacy: user?.marketing, sns: user?.sns });
    }
  }, [user]);

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
          {user?.email}
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
          <Switch isActive={marketing?.privacy} onActive={() => updateMarketing(!marketing?.privacy)} />
        </Flex>
        <Flex align="center" justify="between" className={styles.profile_info} paddingVertical={12}>
          <Text size={1.6}>문자 메시지</Text>
          <Switch isActive={marketing?.sns} onActive={() => updateSms(!marketing?.sns)} />
        </Flex>
      </section>

      <Link href={'/my/withdrawal'} className={styles.withdrawal_button}>
        회원탈퇴
      </Link>
    </section>
  );
};

export default ProfilePage;
