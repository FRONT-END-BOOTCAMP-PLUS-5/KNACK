'use client';

import TabMenu from '@/components/common/TabMenu';
import { likeService } from '@/services/like';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { productsService } from '@/services/products';
import { IRecentProduct } from '@/types/product';
import { IBrandLikeList, ILikeList } from '@/types/like';
import ProductSave from '@/components/saved/ProductSave';
import BrandSave from '@/components/saved/BrandSave';
import RecentlySave from '@/components/saved/RecentlySave';
import { TABS } from '@/constraint/saved';

const SavedPage = () => {
  const { addLike, deleteLike, getLikes, deleteBrandLike, getBrandLikes } = likeService;
  const { getRecentlyProductList } = productsService;
  const [selectTab, setSelectTab] = useState(0);
  const [likeList, setLikeList] = useState<ILikeList[]>([]);
  const [brandLikeList, setBrandLikeList] = useState<IBrandLikeList[]>([]);
  const [recentProducts, setRecentProducts] = useState<IRecentProduct[]>([]);

  const handleGetRecentlyProduct = useCallback(
    (ids: string[]) => {
      const params = new URLSearchParams();

      if (!ids) return;

      ids.forEach((id) => params.append('id', id));

      getRecentlyProductList(params.toString())
        .then((res) => {
          if (res.status === 200) {
            setRecentProducts(res.result);
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [getRecentlyProductList]
  );

  const handleGetBrandLikes = useCallback(() => {
    getBrandLikes()
      .then((res) => {
        if (res.status === 200) {
          setBrandLikeList(res.result);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getBrandLikes]);

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

  const initSave = useCallback(() => {
    handleGetLikes();
  }, [handleGetLikes]);

  const handleDeleteLike = useCallback(
    (id: number) => {
      const deleteId = likeList?.find((item) => item?.product?.id === id)?.id ?? 0;

      deleteLike(deleteId)
        .then((res) => {
          if (res.status === 200) {
            initSave();
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteLike, initSave, likeList]
  );

  const handleLikeAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>, productId: number) => {
      e.preventDefault();

      const likeCheck = likeList?.find((likeItem) => likeItem?.product?.id === productId);

      if (likeCheck) {
        handleDeleteLike(productId);
        alert('제거완료');
      } else {
        addLike(productId)
          .then((res) => {
            if (res.status === 200) {
              alert('잘 담겼어요!');
              handleGetLikes();
            }
          })
          .catch((error) => {
            console.log('error', error.message);
          });
      }
    },
    [addLike, handleDeleteLike, handleGetLikes, likeList]
  );

  const onClickSave = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();

    handleDeleteLike(id);
  };

  useEffect(() => {
    handleGetLikes();
  }, [handleGetLikes]);

  useEffect(() => {
    handleGetBrandLikes();
  }, [handleGetBrandLikes]);

  useEffect(() => {
    const storage = localStorage.getItem('recent') && JSON.parse(localStorage.getItem('recent') ?? '');

    handleGetRecentlyProduct(storage);
  }, [handleGetRecentlyProduct]);

  useEffect(() => {}, []);

  return (
    <section>
      <TabMenu tabs={TABS} selectedTab={selectTab} onTabSelect={setSelectTab} />
      {selectTab === 0 && <ProductSave likeList={likeList} onClickSave={onClickSave} />}
      {selectTab === 1 && <BrandSave brandLikeData={brandLikeList} onClickBookMark={handleDeleteBrandLike} />}
      {selectTab === 2 && (
        <RecentlySave recentProducts={recentProducts} likeList={likeList} onClickSaveAdd={handleLikeAdd} />
      )}
    </section>
  );
};

export default SavedPage;
