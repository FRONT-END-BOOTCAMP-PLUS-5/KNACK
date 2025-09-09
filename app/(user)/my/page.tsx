'use client';

import { useEffect, useState } from 'react';
import styles from './myPage.module.scss';
import Divider from '@/components/common/Divider';
import BuyList from '@/components/my/BuyList';
import ActionGrid from '@/components/my/ActionGrid';
import MyNav from '@/components/my/MyNav';
import ProfileInfo from '@/components/my/ProfileInfo';
import { useUserStore } from '@/store/userStore';
import requester from '@/utils/requester';

export default function MyPage() {
  const { user } = useUserStore();
  const [orderStats, setOrderStats] = useState({ all: 0, delivering: 0, completed: 0 });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await requester.get('/api/orders');

        const orders = data?.orders || [];

        setOrderStats({
          all: orders.total.length,
          delivering: orders.inProgress.length,
          completed: orders.completed.length,
        });
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    })();
  }, []);

  return (
    <section className={styles.my_page}>
      <ProfileInfo user={user} />
      <Divider />
      <ActionGrid user={user} />
      <div className={styles.block} />
      <BuyList all={orderStats.all} delivering={orderStats.delivering} completed={orderStats.completed} />
      <div className={styles.block} />
      <MyNav />
    </section>
  );
}
