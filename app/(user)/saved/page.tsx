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
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

interface SAVED_TABS {
  product: string;
  brand: string;
  recent: string;
}

const SavedPage = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const { addLike, deleteLike, getLikes, deleteBrandLike, getBrandLikes } = likeService;
  const { getRecentlyProductList } = productsService;
  const [selectTab, setSelectTab] = useState(0);
  const [likeList, setLikeList] = useState<ILikeList[]>([]);
  const [brandLikeList, setBrandLikeList] = useState<IBrandLikeList[]>([]);
  const [recentProducts, setRecentProducts] = useState<IRecentProduct[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user?.id) return router.replace('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            alert('삭제완료!');
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteBrandLike, initLikeBrand]
  );

  const handleGetLikes = useCallback(() => {
    if (!user?.id) return;
    getLikes()
      .then((res) => {
        if (res.status === 200) {
          setLikeList(res.result);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getLikes, user]);

  const initSave = useCallback(() => {
    handleGetLikes();
  }, [handleGetLikes]);

  const handleDeleteLike = useCallback(
    (id: number) => {
      deleteLike(id)
        .then((res) => {
          if (res.status === 200) {
            initSave();
            alert('삭제완료!');
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteLike, initSave]
  );

  const handleLikeAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>, productId: number) => {
      e.preventDefault();
      if (!user?.id) return router.push('/login');
      const likeCheck = likeList?.find((likeItem) => likeItem?.product?.id === productId);

      if (likeCheck) {
        handleDeleteLike(productId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addLike, handleDeleteLike, handleGetLikes, likeList, user]
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

  useEffect(() => {
    const tabs = { product: 0, brand: 1, recent: 2 };

    const params = (searchParams.get('tab') as keyof SAVED_TABS) ?? 'product';

    setSelectTab(tabs[params]);
  }, [searchParams]);

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
