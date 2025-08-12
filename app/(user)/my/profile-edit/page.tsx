'use client';

import Flex from '@/components/common/Flex';
import styles from './profileEditPage.module.scss';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import UserDefault from '@/public/images/profile_default.png';
import { myService } from '@/services/my';
import { IUpdateUserRef } from '@/types/user';

const ProfileEditPage = () => {
  const [profileNameOn, setProfileNameOn] = useState(false);
  const [nameOn, setNameOn] = useState(false);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>('');

  const { user, fetchUserData } = useUserStore();
  const { updateUser } = myService;

  const updateProfile = () => {
    const data: IUpdateUserRef = {
      nickname: nickname,
      name: name,
      profileImage: profileImage ?? '',
    };

    updateUser(data)
      .then((res) => {
        setProfileNameOn(false);
        setNameOn(false);
        fetchUserData(user?.id ?? '');
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  const handleCancelProfileName = () => {
    setProfileNameOn(false);
    setNickname(user?.nickname ?? '');
  };

  const handleCancelName = () => {
    setNameOn(false);
    setName(user?.name ?? '');
  };

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setNickname(user?.nickname);
      setProfileImage(user?.profileImage);
    }
  }, [user]);

  return (
    <Flex tag="section" direction="column" paddingHorizontal={16}>
      <Flex paddingVertical={16} align="center">
        <span className={styles.profile_image}>
          <Image src={user?.profileImage ? user?.profileImage : UserDefault} alt="프로필" fill />
        </span>
        <Flex direction="column" width="self">
          <Text size={1.8} weight={600}>
            {user?.nickname}
          </Text>
          <button className={styles.profile_edit_button}>이미지 변경</button>
        </Flex>
      </Flex>
      <Text size={1.8} weight={700} marginTop={24}>
        프로필 정보
      </Text>
      <Flex
        direction="column"
        className={`${styles.profile_info} ${profileNameOn && styles.border_none}`}
        paddingVertical={12}
      >
        <Text size={1.3} color="gray2">
          프로필 이름
        </Text>
        {!profileNameOn && (
          <Flex justify="between" align="center">
            <Text size={1.6} weight={500} paddingTop={8} paddingBottom={8}>
              {nickname}
            </Text>
            <button className={styles.change_button} onClick={() => setProfileNameOn(true)}>
              변경
            </button>
          </Flex>
        )}
        {profileNameOn && (
          <Flex direction="column" align="center">
            <input
              type="text"
              placeholder="프로필 이름"
              className={styles.change_input}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Flex width="self" gap={8} justify="center">
              <Button
                className={styles.button_size}
                text="취소"
                size="self"
                style="border"
                onClick={handleCancelProfileName}
              />
              <Button className={styles.button_size} text="저장" size="self" style="black" onClick={updateProfile} />
            </Flex>
          </Flex>
        )}
      </Flex>

      <Flex
        direction="column"
        className={`${styles.profile_info} ${nameOn && styles.border_none}`}
        paddingVertical={12}
      >
        <Text size={1.3} color="gray2">
          이름
        </Text>
        {!nameOn && (
          <Flex justify="between" align="center">
            <Text size={1.6} weight={500} paddingTop={8} paddingBottom={8}>
              {name}
            </Text>
            <button className={styles.change_button} onClick={() => setNameOn(true)}>
              변경
            </button>
          </Flex>
        )}
        {nameOn && (
          <Flex direction="column" align="center">
            <input
              type="text"
              placeholder="이름"
              className={styles.change_input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Flex width="self" gap={8} justify="center">
              <Button
                className={styles.button_size}
                text="취소"
                size="self"
                style="border"
                onClick={handleCancelName}
              />
              <Button className={styles.button_size} text="저장" size="self" style="black" onClick={updateProfile} />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default ProfileEditPage;
