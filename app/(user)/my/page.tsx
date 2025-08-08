'use client';

import { useRouter } from 'next/navigation';
import styles from './myPage.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';

export default function MyPage() {
  const router = useRouter();

  const handleWithdrawalClick = () => {
    router.push('/my/withdrawal');
  };

  return (
    <main className={styles.my_page}>
      <section>
        <Flex>
          <span className={styles.profile_image}>프로필</span>
          <Flex direction="column" width="self">
            <Text>닉네임</Text>
            <Text>아이디</Text>
            <Button style="border" size="medium" text="프로필 관리" />
          </Flex>
        </Flex>
      </section>

      <button className={styles.withdrawal_button} onClick={handleWithdrawalClick}>
        회원탈퇴
      </button>
    </main>
  );
}
