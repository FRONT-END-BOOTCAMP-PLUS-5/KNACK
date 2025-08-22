'use client';
import { useEffect, useState } from 'react';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import BookMarkOn from '@/public/icons/book_mark_active.svg';
import styles from './categoryBrandModal.module.scss';
import { brandService } from '@/services/brand';
import { IBrandWithTagList } from '@/types/brand';

export default function BrandTab() {
  const [brands, setBrands] = useState<IBrandWithTagList[]>([]);

  useEffect(() => {
    const initBrands = async () => {
      try {
        const res = await brandService.getBrands();
        console.log('브랜드 데이터:', res);
        setBrands(res);
      } catch (error) {
        console.error('브랜드 데이터 호출 실패 : ', error);
      }
    };

    initBrands();
  }, []);

  return (
    <article className={styles.brand_container}>
      <section>
        {brands.length > 0 && (
          <Flex style={{ width: '100%', overflow: 'hidden' }}>
            {brands.map((brandGroup) => (
              <Text size={1.5} color="gray5" paddingLeft={16} key={brandGroup.tag}>
                {brandGroup.tag}
              </Text>
            ))}
            {brands.map((brandGroup) => (
              <Text size={1.5} color="gray5" paddingLeft={16} key={brandGroup.tag}>
                {brandGroup.tag}
              </Text>
            ))}
          </Flex>
        )}
      </section>
      {brands.length > 0 &&
        brands.map((brandGroup) =>
          brandGroup.brandList.map((brand) => (
            <section key={brand.id} className={styles.brand_item}>
              <Flex justify="between" align="center">
                <Flex gap={16} align="center">
                  <span className={styles.logo_image}>
                    <Image
                      src={`${STORAGE_PATHS?.PRODUCT?.LOGO}/${brand.logoImage}`}
                      alt="로고 이미지"
                      width={40}
                      height={40}
                    />
                  </span>
                  <Flex direction="column" width="self">
                    <Text size={1.5} weight={700}>
                      {brand.engName}
                    </Text>
                    <Text size={1.2} color="gray2" marginTop={4}>
                      {brand.korName}ㆍ관심 {brand.likesCount}
                    </Text>
                  </Flex>
                </Flex>
                <button className={styles.book_mark_button}>
                  <Image src={BookMarkOn} alt="좋아요 아이콘" width={20} height={20} />
                </button>
              </Flex>
            </section>
          ))
        )}
    </article>
  );
}
