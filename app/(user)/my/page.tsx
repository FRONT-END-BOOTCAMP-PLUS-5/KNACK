'use client';

import styles from './myPage.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Divider from '@/components/common/Divider';
import BuyList from '@/components/my/BuyList';
import ActionGrid from '@/components/my/ActionGrid';
import MyNav from '@/components/my/MyNav';

export default function MyPage() {
  return (
    <section className={styles.my_page}>
      <section>
        <Flex paddingVertical={16} paddingHorizontal={24}>
          <span className={styles.profile_image}>프로필</span>
          <Flex direction="column" width="self">
            <Text size={1.8} weight={600}>
              닉네임
            </Text>
            <Text size={1.4} color="gray2" marginTop={2}>
              아이디
            </Text>
            <button className={styles.profile_edit_button}>프로필 관리</button>
          </Flex>
        </Flex>
      </section>
      <Divider />
      <ActionGrid />
      <div className={styles.block} />
      <BuyList />
      <div className={styles.block} />
      <MyNav />
    </section>
  );
}
