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
import { useLikeStore } from '@/store/likeStore';
import LikeToast from '../LikeToast';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

interface IProps {
  brandData?: IBrand;
}

const BrandInfo = ({ brandData }: IProps) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { addBrandLike, getBrandLikes, deleteBrandLike } = likeService;
  const [likedCheck, setLikedCheck] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const { productDetailBrandLike: storeLike, setProductDetailBrandLike: setStoreLike } = useLikeStore();

  const handleGetBrandLikes = useCallback(() => {
    if (!user?.id) return;
    getBrandLikes()
      .then((res) => {
        if (res.status === 200) {
          const checked = res.result.some((item: IBrandLikeList) => item?.brand?.id === brandData?.id);

          setLikedCheck(checked);

          const findCount: IBrandLikeList = res.result.find(
            (item: IBrandLikeList) => item?.brand?.id === brandData?.id
          );

          setStoreLike(findCount?.brand?._count?.brandLike ?? 0, checked);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [brandData, getBrandLikes, setStoreLike, user]);

  const initLikeBrand = useCallback(() => {
    handleGetBrandLikes();
  }, [handleGetBrandLikes]);

  const handleDeleteBrandLike = useCallback(
    (id: number) => {
      deleteBrandLike(id)
        .then((res) => {
          if (res.status === 200) {
            alert('취소완료!');
            setStoreLike(storeLike.count - 1, false);
            setLikedCheck(!likedCheck);
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteBrandLike, setStoreLike, storeLike.count, likedCheck]
  );

  const handleAddBrandLike = useCallback(
    (id: number) => {
      if (!user?.id) return router.push('/login');
      if (likedCheck) {
        handleDeleteBrandLike(id);
      } else {
        addBrandLike(id)
          .then((res) => {
            if (res.status === 200) {
              setStoreLike(storeLike.count + 1, true);
              setToastOpen(true);
              setLikedCheck(!likedCheck);
            }
          })
          .catch((error) => {
            console.log('error', error.message);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addBrandLike, handleDeleteBrandLike, likedCheck, storeLike, setStoreLike, user]
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
            {brandData?.korName} ㆍ 관심 {storeLike.count}
          </Text>
        </Flex>
      </Flex>

      <button className={styles.brand_like_button} onClick={() => handleAddBrandLike(brandData?.id ?? 0)}>
        <Image src={storeLike?.status ? onBookMark : bookmark} alt="좋아요" width={22} height={22} />
      </button>

      <LikeToast
        open={toastOpen}
        setOpen={() => setToastOpen(false)}
        message="관심 브랜드에 저장되었습니다."
        link="/saved?tab=brand"
      />
    </article>
  );
};

export default BrandInfo;
