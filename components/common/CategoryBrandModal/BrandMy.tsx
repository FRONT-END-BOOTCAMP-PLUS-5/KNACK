'use client';
import { MouseEvent, useEffect, useState } from 'react';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import BookMarkOn from '@/public/icons/book_mark_active.svg';
import styles from './categoryBrandModal.module.scss';
import { likeService } from '@/services/like';
import { IBrandLikeList } from '@/types/like';
import EmptyText from '@/components/saved/EmptyText';
import Link from 'next/link';

export default function BrandMy() {
  const [likedBrands, setLikedBrands] = useState<IBrandLikeList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getBrandLikes, deleteBrandLike } = likeService;

  useEffect(() => {
    const initLikedBrands = async () => {
      try {
        setIsLoading(true);
        const res = await getBrandLikes();
        if (res.status === 200) {
          setLikedBrands(res.result);
        }
      } catch (error) {
        console.error('좋아요한 브랜드 데이터 호출 실패 : ', error);
      } finally {
        setIsLoading(false);
      }
    };

    initLikedBrands();
  }, [getBrandLikes]);

  const handleDeleteBrandLike = async (e: MouseEvent<HTMLButtonElement>, brandLikeId: number) => {
    e.preventDefault();

    try {
      const res = await deleteBrandLike(brandLikeId);
      if (res.status === 200) {
        const updatedBrands = likedBrands.filter((brand) => brand.brand?.id !== brandLikeId);
        setLikedBrands(updatedBrands);
      }
    } catch (error) {
      console.error('브랜드 좋아요 삭제 실패 : ', error);
    }
  };

  return (
    <div className={styles.brand_list_container}>
      {likedBrands.length > 0 &&
        likedBrands.map((likedBrand) => (
          <Link
            key={likedBrand?.brand?.id}
            className={styles.brand_item}
            href={`/search?keyword=${likedBrand.brand.korName}`}
          >
            <Flex justify="between" align="center">
              <Flex gap={16} align="center">
                <span className={styles.logo_image}>
                  <Image
                    src={`${STORAGE_PATHS?.PRODUCT?.LOGO}/${likedBrand.brand?.logoImage}`}
                    alt="로고 이미지"
                    width={40}
                    height={40}
                  />
                </span>
                <Flex direction="column" width="self">
                  <Text size={1.5} weight={700}>
                    {likedBrand.brand?.engName}
                  </Text>
                  <Text size={1.2} color="gray2" marginTop={4}>
                    {likedBrand.brand?.korName}ㆍ관심 {likedBrand.brand?._count?.brandLike}
                  </Text>
                </Flex>
              </Flex>
              <button
                className={styles.book_mark_button}
                onClick={(e) => handleDeleteBrandLike(e, likedBrand?.brand?.id)}
              >
                <Image src={BookMarkOn} alt="좋아요 아이콘" width={20} height={20} />
              </button>
            </Flex>
          </Link>
        ))}
      {!isLoading && likedBrands.length === 0 && (
        <EmptyText mainText="저장한 브랜드가 아직 없어요." subText="관심 있는 브랜드를 저장해보세요." />
      )}
    </div>
  );
}
