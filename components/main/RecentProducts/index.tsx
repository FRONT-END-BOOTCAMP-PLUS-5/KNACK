'use client';

import Flex from '@/components/common/Flex';
import styles from './recentProducts.module.scss';
import Text from '@/components/common/Text';
import { useCallback, useEffect, useState } from 'react';
import { productsService } from '@/services/products';
import { IRecentProduct } from '@/types/product';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css/free-mode';

const RecentProducts = () => {
  const { getRecentlyProductList } = productsService;

  const [recentProducts, setRecentProducts] = useState<IRecentProduct[][]>([]);

  const conversionArray = (value: IRecentProduct[], size: number) => {
    return value.reduce<IRecentProduct[][]>((acc, _, i) => {
      if (i % size === 0) {
        acc.push(value.slice(i, i + size));
      }
      return acc;
    }, []);
  };

  const handleGetRecentlyProduct = useCallback(
    (ids: string[]) => {
      const params = new URLSearchParams();

      if (!ids) return;

      ids.forEach((id) => params.append('id', id));

      getRecentlyProductList(params.toString())
        .then((res) => {
          if (res.status === 200) {
            const result = conversionArray(res.result, 2);

            setRecentProducts(result);
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [getRecentlyProductList]
  );

  useEffect(() => {
    const storage = localStorage.getItem('recent') && JSON.parse(localStorage.getItem('recent') ?? '');

    handleGetRecentlyProduct(storage);
  }, [handleGetRecentlyProduct]);

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
        {recentProducts?.map((item, index) => (
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
                    관심
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
