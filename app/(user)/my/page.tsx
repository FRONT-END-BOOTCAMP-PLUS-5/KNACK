'use client';

import styles from './myPage.module.scss';
import Divider from '@/components/common/Divider';
import BuyList from '@/components/my/BuyList';
import ActionGrid from '@/components/my/ActionGrid';
import MyNav from '@/components/my/MyNav';
import ProfileInfo from '@/components/my/ProfileInfo';
import { useUserStore } from '@/store/userStore';

export default function MyPage() {
  const { user } = useUserStore();

  return (
    <section className={styles.my_page}>
      <ProfileInfo user={user} />
      <Divider />
      <ActionGrid />
      <div className={styles.block} />
      <BuyList />
      <div className={styles.block} />
      <MyNav />
    </section>
  );
}
