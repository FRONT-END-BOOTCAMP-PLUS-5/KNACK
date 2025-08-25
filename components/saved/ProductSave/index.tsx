'use client';

import Flex from '@/components/common/Flex';
import styles from './productSave.module.scss';
import Image from 'next/image';
import Text from '@/components/common/Text';
import { ILikeList } from '@/types/like';
import { STORAGE_PATHS } from '@/constraint/auth';
import BookMarkOn from '@/public/icons/book_mark_active.svg';
import EmptyText from '../EmptyText';
import Link from 'next/link';
import { MouseEvent } from 'react';

interface IProps {
  likeList: ILikeList[];
  onClickSave: (e: MouseEvent<HTMLButtonElement>, id: number) => void;
}

const ProductSave = ({ likeList, onClickSave }: IProps) => {
  return (
    <Flex paddingHorizontal={16} direction="column">
      {likeList?.length === 0 && (
        <EmptyText
          mainText="저장한 상품이 없어요."
          subText="요즘 많이 찾는 아이템을 구경해보세요."
          buttonText="인기 상품 보기"
          url="search"
        />
      )}

      {likeList?.length > 0 &&
        likeList?.map(({ product: item }) => {
          return (
            <Flex key={item?.id} paddingVertical={16} align="center" className={styles.like_item}>
              <Link className={styles.product_image} href={`/products/${item?.id}`}>
                <Image src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item?.thumbnailImage}`} alt="상품 이미지" fill />
              </Link>
              <Flex direction="column">
                <Flex className={styles.top_content} justify="between">
                  <Link href={`/products/${item?.id}`}>
                    <Flex direction="column">
                      <Text size={1.2} weight={700} lineHeight="1.7rem">
                        {item?.korName}
                      </Text>
                      <Text size={1.3}>{item?.engName}</Text>
                    </Flex>
                  </Link>
                  <button className={styles.save_button} onClick={(e) => onClickSave(e, item?.id)}>
                    <Image src={BookMarkOn} alt="저장" width={20} height={20} />
                  </button>
                </Flex>

                <Flex className={styles.bottom_content} align="end" justify="between">
                  <div />
                  <Text size={1.4} weight={700}>
                    {item?.price?.toLocaleString()}원
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          );
        })}
    </Flex>
  );
};

export default ProductSave;
