import Text from '@/components/common/Text';
import styles from './myNav.module.scss';
import Flex from '@/components/common/Flex';
import Link from 'next/link';

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
  {
    id: 3,
    url: '/my/size',
    name: '나의 맞춤 정보',
  },
];

const MyNav = () => {
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
    </section>
  );
};

export default MyNav;
