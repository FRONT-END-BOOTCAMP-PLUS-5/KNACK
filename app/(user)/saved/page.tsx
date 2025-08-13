'use client';

import TabMenu from '@/components/common/TabMenu';
import styles from './saved.module.scss';
import { likeService } from '@/services/like';
import { useCallback, useEffect, useState } from 'react';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import BookMarkOn from '@/public/icons/book_mark_active.svg';
import Image from 'next/image';
import { productsService } from '@/services/products';
import { IProducts } from '@/types/product';
import { STORAGE_PATHS } from '@/constraint/auth';
import { ILikeList } from '@/types/like';

const TABS = [
  { id: 0, name: '상품' },
  { id: 1, name: '브랜드' },
  { id: 2, name: '최근 본 상품' },
];

const SavedPage = () => {
  const { addLike, deleteLike, getLikes } = likeService;
  const { getProductList } = productsService;
  const [selectTab, setSelectTab] = useState(0);
  const [productList, setProductList] = useState<IProducts[]>([]);
  const [likeList, setLikeList] = useState<ILikeList[]>([]);

  const handleLikeAdd = useCallback(() => {
    const data = {
      productId: 7,
      optionValueId: 2,
    };

    addLike(data)
      .then((res) => {
        console.log('res', res);
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [addLike]);

  const handleGetLikes = useCallback(() => {
    getLikes()
      .then((res) => {
        if (res.status === 200) {
          setLikeList(res.result);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getLikes]);

  const handleProductList = useCallback(() => {
    const ids = likeList?.map((item) => item?.productId).map(String);
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('id', id));

    getProductList(params.toString())
      .then((res) => {
        if (res.status === 200) {
          setProductList(res.result);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getProductList, likeList]);

  const onClickSave = (id: number) => {
    handleDeleteLike(id);
  };

  const initSave = useCallback(() => {
    handleProductList();
    handleGetLikes();
  }, [handleGetLikes, handleProductList]);

  const handleDeleteLike = useCallback(
    (id: number) => {
      const deleteId = likeList?.find((item) => item?.productId === id)?.id ?? 0;

      deleteLike(deleteId)
        .then((res) => {
          console.log('res', res);
          initSave();
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteLike, initSave, likeList]
  );

  useEffect(() => {
    handleProductList();
  }, [handleProductList]);

  useEffect(() => {
    handleGetLikes();
  }, [handleGetLikes]);

  return (
    <section>
      <TabMenu tabs={TABS} selectedTab={selectTab} onTabSelect={setSelectTab} />
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
    </section>
  );
};

export default SavedPage;
