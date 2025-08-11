import Text from '@/components/common/Text';
import styles from './myNav.module.scss';
import Flex from '@/components/common/Flex';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const MY_NAV_LIST = [
  {
    id: 0,
    url: '/my/profile',
    name: '로그인 정보',
  },
  {
    id: 1,
    url: '/my/profile-edit',
    name: '프로필 관리',
  },

  {
    id: 2,
    url: '/my/address',
    name: '주소록',
  },
];

const MyNav = () => {
  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      });
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  return (
    <section className={styles.my_account_wrap}>
      <Text size={1.6} weight={700} paddingBottom={8}>
        내 계정
      </Text>
      {MY_NAV_LIST?.map((item) => (
        <Flex key={item?.id} className={styles.nav_item} tag="nav" paddingVertical={18}>
          <Link href={item?.url}>
            <Text size={1.5}>{item?.name}</Text>
          </Link>
        </Flex>
      ))}
      <button className={styles.logout_button} onClick={handleLogout}>
        로그아웃
      </button>
    </section>
  );
};

export default MyNav;
