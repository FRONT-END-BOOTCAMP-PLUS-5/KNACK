'use client';

import styles from './brandInfo.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import { STORAGE_PATHS } from '@/constraint/auth';
import { IBrand } from '@/types/productDetail';
import Image from 'next/image';
import bookmark from '@/public/icons/book_mark.svg';
import onBookMark from '@/public/icons/book_mark_active.svg';
import { useCallback, useEffect, useState } from 'react';
import { likeService } from '@/services/like';
import { IBrandLikeList } from '@/types/like';

interface IProps {
  brandData?: IBrand;
}

const BrandInfo = ({ brandData }: IProps) => {
  const { addBrandLike, getBrandLikes, deleteBrandLike } = likeService;
  const [brandLikeList, setBrandLikeList] = useState<IBrandLikeList[]>([]);
  const [likedCheck, setLikedCheck] = useState(false);

  const handleGetBrandLikes = useCallback(() => {
    getBrandLikes()
      .then((res) => {
        if (res.status === 200) {
          const checked = res.result.some((item: IBrandLikeList) => item?.brand?.id === brandData?.id);

          setBrandLikeList(res.result);
          setLikedCheck(checked);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [brandData, getBrandLikes]);

  const handleAddBrandLike = useCallback(
    (id: number) => {
      addBrandLike(id)
        .then((res) => {
          if (res.status === 200) {
            handleGetBrandLikes();
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [addBrandLike, handleGetBrandLikes]
  );

  const initLikeBrand = useCallback(() => {
    handleGetBrandLikes();
  }, [handleGetBrandLikes]);

  const handleDeleteBrandLike = useCallback(
    (id: number) => {
      deleteBrandLike(id)
        .then((res) => {
          if (res.status === 200) {
            initLikeBrand();
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteBrandLike, initLikeBrand]
  );

  useEffect(() => {
    initLikeBrand();
  }, [initLikeBrand]);

  return (
    <article className={styles.brand_wrap}>
      <Flex gap={16} align="center">
        <div className={styles.brand_logo_wrap}>
          <Image
            src={`${STORAGE_PATHS.PRODUCT.LOGO}/${brandData?.logoImage ?? ''}`}
            width={40}
            height={40}
            alt="브랜드 로고"
          />
        </div>
        <Flex direction="column" width="self">
          <Text size={1.5} weight={600}>
            {brandData?.engName}
          </Text>
          <Text size={1.2} color="gray2">
            {brandData?.korName} ㆍ 관심 {0}
          </Text>
        </Flex>
      </Flex>
      {likedCheck && (
        <button
          className={styles.brand_like_button}
          onClick={() =>
            handleDeleteBrandLike(brandLikeList?.find((item) => item?.brand?.id === brandData?.id)?.id ?? 0)
          }
        >
          <Image src={onBookMark} alt="좋아요" width={22} height={22} />
        </button>
      )}
      {!likedCheck && (
        <button className={styles.brand_like_button} onClick={() => handleAddBrandLike(brandData?.id ?? 0)}>
          <Image src={bookmark} alt="좋아요" width={22} height={22} />
        </button>
      )}
    </article>
  );
};

export default BrandInfo;
