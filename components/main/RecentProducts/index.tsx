'use client';

import Flex from '@/components/common/Flex';
import styles from './recentProducts.module.scss';
import Text from '@/components/common/Text';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css/free-mode';
import { useSavedRecent } from '@/hooks/saved/useSavedRecent';

const RecentProducts = () => {
  const { mainRecentProducts } = useSavedRecent();

  if (mainRecentProducts?.length === 0) return;

  return (
    <div className={styles.recent_container}>
      <Flex align="center" justify="between">
        <Text size={1.6} weight={600} marginBottom={8}>
          최근 본 상품
        </Text>
        <Link className={styles.more_text} href={'/saved?tab=recent'}>
          더보기
        </Link>
      </Flex>
      <Swiper
        style={{ width: '100%' }}
        slidesPerView={2}
        spaceBetween={15}
        freeMode={true}
        modules={[FreeMode]}
        breakpoints={{
          320: {
            slidesPerView: 2.5,
          },
          400: {
            slidesPerView: 3,
          },
          439: {
            slidesPerView: 3.3,
          },
        }}
      >
        {mainRecentProducts?.map((item, index) => (
          <SwiperSlide key={'recent_swiper_' + index} className={styles.swiper_slide}>
            {item?.map((value) => (
              <Link key={'recent_product_' + value?.id} href={`/products/${value?.id}`}>
                <Flex style={{ width: '111px' }} direction="column" width="self">
                  <span className={styles.image_box}>
                    <Image
                      src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${value?.thumbnailImage}`}
                      width={111}
                      height={111}
                      alt="상품이미지"
                    />
                  </span>
                  <Text className={styles.product_name} size={1.3} marginBottom={3}>
                    {value?.korName}
                  </Text>
                  <Text size={1.2} weight={600} marginBottom={3}>
                    {value?.price?.toLocaleString()}
                  </Text>
                  <Text size={1.1} color="lightGray1">
                    관심 {value?._count?.productLike}
                  </Text>
                </Flex>
              </Link>
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecentProducts;
