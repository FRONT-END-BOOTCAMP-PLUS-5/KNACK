'use client';

import Flex from '@/components/common/Flex';
import styles from './profileEditPage.module.scss';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import { useState } from 'react';

const ProfileEditPage = () => {
  const [profileNameOn, setProfileNameOn] = useState(false);
  const [nameOn, setNameOn] = useState(false);

  return (
    <Flex tag="section" direction="column" paddingHorizontal={16}>
      <Flex paddingVertical={16} align="center">
        <span className={styles.profile_image}>프로필</span>
        <Flex direction="column" width="self">
          <Text size={1.8} weight={600}>
            닉네임
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
              닉네임
            </Text>
            <button className={styles.change_button} onClick={() => setProfileNameOn(true)}>
              변경
            </button>
          </Flex>
        )}
        {profileNameOn && (
          <Flex direction="column" align="center">
            <input type="text" placeholder="프로필 이름" className={styles.change_input} />
            <Flex width="self" gap={8} justify="center">
              <Button
                className={styles.button_size}
                text="취소"
                size="self"
                style="border"
                onClick={() => setProfileNameOn(false)}
              />
              <Button className={styles.button_size} text="저장" size="self" style="black" />
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
              장도영
            </Text>
            <button className={styles.change_button} onClick={() => setNameOn(true)}>
              변경
            </button>
          </Flex>
        )}
        {nameOn && (
          <Flex direction="column" align="center">
            <input type="text" placeholder="이름" className={styles.change_input} />
            <Flex width="self" gap={8} justify="center">
              <Button
                className={styles.button_size}
                text="취소"
                size="self"
                style="border"
                onClick={() => setNameOn(false)}
              />
              <Button className={styles.button_size} text="저장" size="self" style="black" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default ProfileEditPage;
