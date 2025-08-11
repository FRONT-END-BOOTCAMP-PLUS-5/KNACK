'use client';

import Flex from '@/components/common/Flex';
import styles from './profileInfo.module.scss';
import Text from '@/components/common/Text';
import { User } from '@/store/userStore';
import UserDefault from '@/public/images/profile_default.png';
import Image from 'next/image';

interface IProps {
  user?: User | null;
}

const ProfileInfo = ({ user }: IProps) => {
  return (
    <section>
      <Flex paddingVertical={16} paddingHorizontal={24}>
        <span className={styles.profile_image}>
          <Image src={user?.profileImage ? user?.profileImage : UserDefault} alt="프로필" fill />
        </span>
        <Flex direction="column" width="self">
          <Text size={1.8} weight={600}>
            {user?.nickname}
          </Text>
          <Text size={1.4} color="gray2" marginTop={2}>
            {user?.email}
          </Text>
          <button className={styles.profile_edit_button}>프로필 관리</button>
        </Flex>
      </Flex>
    </section>
  );
};

export default ProfileInfo;
