'use client';
import { MouseEvent } from 'react';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import BookMarkOn from '@/public/icons/book_mark_active.svg';
import styles from './categoryBrandModal.module.scss';
import { IBrandLikeList } from '@/types/like';
import EmptyText from '@/components/saved/EmptyText';
import Link from 'next/link';
import { useBrandLike } from '@/hooks/brand/useBrandLike';
import { useToggleBrandLike } from '@/hooks/brand/useToggleBrandLike';
import Loading from '@/public/images/loading.gif';

export default function BrandMy() {
  const { data: response, isLoading, error, isSuccess, isError } = useBrandLike();
  const { mutate: toggleBrandLike, isPending } = useToggleBrandLike();

  // API 응답 구조에 따라 데이터 추출
  const likedBrands = response?.result || response || [];

  // 에러 발생 시 콘솔에 출력
  if (error) {
    console.error('좋아요한 브랜드 데이터 호출 실패:', error);
  }

  const handleDeleteBrandLike = async (e: MouseEvent<HTMLButtonElement>, brandId: number) => {
    e.preventDefault();

    toggleBrandLike({ isLiked: true, id: brandId });
  };

  if (isLoading) {
    return (
      <div className={styles.brand_list_container}>
        <Flex justify="center" align="center" paddingVertical={100}>
          <Image src={Loading} alt="로딩 이미지" width={100} height={100} />
        </Flex>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.brand_list_container}>
        <Flex justify="center" align="center" paddingVertical={100}>
          <Text size={1.6} color="red1">
            관심 브랜드를 불러오는데 실패했습니다.
          </Text>
        </Flex>
      </div>
    );
  }

  return (
    <div className={styles.brand_list_container}>
      {isSuccess &&
        likedBrands.length > 0 &&
        likedBrands.map((likedBrand: IBrandLikeList) => (
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
                disabled={isPending}
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
