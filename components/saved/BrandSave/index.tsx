'use client';

import Text from '@/components/common/Text';
import styles from './brandSave.module.scss';
import Flex from '@/components/common/Flex';
import Image from 'next/image';
import BookMarkOn from '@/public/icons/book_mark_active.svg';
import { IBrandLikeList } from '@/types/like';
import { STORAGE_PATHS } from '@/constraint/auth';

interface IProps {
  brandLikeData: IBrandLikeList[];
  onClickBookMark: (id: number) => void;
}

const BrandSave = ({ brandLikeData, onClickBookMark }: IProps) => {
  return (
    <section className={styles.container}>
      <Text size={1.3} paddingTop={12} paddingBottom={24}>
        전체 {brandLikeData?.length}
      </Text>
      <Flex direction="column" gap={20}>
        {brandLikeData?.length > 0 &&
          brandLikeData?.map((item) => (
            <Flex key={item?.id} className={styles.save_item} tag="article" direction="column" gap={20}>
              <Flex justify="between" align="center">
                <Flex gap={16} align="center">
                  <span className={styles.logo_image}>
                    <Image
                      src={`${STORAGE_PATHS?.PRODUCT?.LOGO}/${item?.brand?.logoImage}`}
                      alt="로고 이미지"
                      width={40}
                      height={40}
                    />
                  </span>
                  <Flex direction="column" width="self">
                    <Text size={1.5} weight={700}>
                      {item?.brand?.engName}
                    </Text>
                    <Text size={1.2} color="gray2" marginTop={4}>
                      리복ㆍ관심 {item?.brand?._count?.brandLike}
                    </Text>
                  </Flex>
                </Flex>
                <button className={styles.book_mark_button} onClick={() => onClickBookMark(item?.id)}>
                  <Image src={BookMarkOn} alt="좋아요 아이콘" width={20} height={20} />
                </button>
              </Flex>
              <Flex gap={8}>
                {item?.brand?.products?.map((brandProduct) => (
                  <Flex key={brandProduct?.id + '_' + brandProduct?.engName} direction="column" width="self">
                    <span className={styles.product_image}>
                      <Image
                        src={`${STORAGE_PATHS?.PRODUCT?.THUMBNAIL}/${brandProduct?.thumbnailImage}`}
                        alt="thumbnail"
                        width={105}
                        height={105}
                      />
                    </span>
                    <Text className={styles.product_title} size={1.2} marginBottom={5}>
                      {brandProduct?.engName}
                    </Text>
                    <Text size={1.2} weight={700}>
                      {brandProduct?.price.toLocaleString()}원
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          ))}
      </Flex>
    </section>
  );
};

export default BrandSave;
