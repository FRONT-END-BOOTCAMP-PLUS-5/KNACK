import styles from './mainPage.module.scss';
import Flex from '@/components/common/Flex';
import BannerSlide from '@/components/main/BannerSlide';
import MiddleBanner from '@/components/main/MiddleBanner';
import RecentProducts from '@/components/main/RecentProducts';
import SearchCategory from '@/components/search/SearchCategory';
import 'swiper/css';

export default function Home() {
  return (
    <section className={styles.home_container}>
      <BannerSlide />
      <Flex paddingVertical={16} justify="center">
        <SearchCategory />
      </Flex>
      <RecentProducts />
      <MiddleBanner />
    </section>
  );
}
