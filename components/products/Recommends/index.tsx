'use client';

import { productsService } from '@/services/products';
import styles from './recommends.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import { IRecommendProduct } from '@/types/product';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import Link from 'next/link';
import { useScrollStore } from '@/store/scrollStore';

const Recommends = () => {
  const { getRecommendProducts } = productsService;
  const { setScrollHeight, setScrollType } = useScrollStore();
  const recommendRef = useRef<HTMLDivElement>(null);

  const [recommends, setRecommends] = useState<IRecommendProduct[]>([]);

  const handleGetRecommend = useCallback(() => {
    getRecommendProducts().then((res) => {
      if (res.result) {
        setRecommends(res.result);
      }
    });
  }, [getRecommendProducts]);

  useEffect(() => {
    handleGetRecommend();
  }, [handleGetRecommend]);

  useEffect(() => {
    const scroll = recommendRef?.current?.getBoundingClientRect().top;

    setScrollHeight(scroll ?? 0, 'recommend');
    setScrollType('recommend');
  }, [setScrollHeight, setScrollType]);

  return (
    <Flex className={styles.container} paddingHorizontal={14} paddingVertical={30} direction="column">
      <div ref={recommendRef} />
      <Text size={1.6} weight={700}>
        추천 상품
      </Text>
      <Flex className={styles.recommend_box} gap={10} paddingVertical={20}>
        {recommends?.map((item) => (
          <Flex key={`recommend_products_${item?.id}`} direction="column">
            <Link className={styles.image_box} href={`/products/${item?.id}`}>
              <Image
                src={`${STORAGE_PATHS?.PRODUCT?.THUMBNAIL}/${item?.thumbnailImage}`}
                width={142}
                height={142}
                alt={item?.korName}
              />
            </Link>
            <Text className={styles.text_overflow} marginBottom={4} weight={700} size={1.3}>
              {item?.brand?.engName}
            </Text>
            <Text className={styles.text_overflow} marginBottom={8}>
              {item?.engName}
            </Text>
            <Text className={styles.text_overflow} weight={700}>
              {item?.price?.toLocaleString()}원
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default Recommends;
