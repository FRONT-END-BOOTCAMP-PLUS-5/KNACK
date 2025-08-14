'use client';

import Flex from '@/components/common/Flex';
import styles from './productSave.module.scss';
import Image from 'next/image';
import Text from '@/components/common/Text';
import { IProducts } from '@/types/product';
import { ILikeList } from '@/types/like';
import { STORAGE_PATHS } from '@/constraint/auth';
import BookMarkOn from '@/public/icons/book_mark_active.svg';

interface IProps {
  productList: IProducts[];
  likeList: ILikeList[];
  onClickSave: (id: number) => void;
}

const ProductSave = ({ productList, likeList, onClickSave }: IProps) => {
  return (
    <Flex paddingHorizontal={16} direction="column">
      {productList?.length > 0 &&
        productList?.map((item) => {
          const likeOptionValueId = likeList?.find((likeItem) => likeItem?.productId === item?.id)?.optionValueId;
          const optionValues = item?.productOptionMappings[0]?.optionType?.optionValue;
          const findOptionName = optionValues?.find((optionValue) => optionValue?.id === likeOptionValueId)?.name;

          return (
            <Flex key={item?.id} paddingVertical={16} align="center" className={styles.like_item}>
              <span className={styles.product_image}>
                <Image src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item?.thumbnailImage}`} alt="상품 이미지" fill />
              </span>
              <Flex direction="column">
                <Flex className={styles.top_content}>
                  <Flex direction="column">
                    <Text size={1.2} weight={700} lineHeight="1.7rem">
                      {item?.korName}
                    </Text>
                    <Text size={1.3}>{item?.engName}</Text>
                  </Flex>
                  <button className={styles.save_button} onClick={() => onClickSave(item?.id)}>
                    <Image src={BookMarkOn} alt="저장" width={18} height={18} />
                  </button>
                </Flex>

                <Flex className={styles.bottom_content} align="end" justify="between">
                  <Text size={1.4} weight={700}>
                    {findOptionName}
                  </Text>
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
