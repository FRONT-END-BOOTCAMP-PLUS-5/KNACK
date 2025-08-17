'use client';

import TabMenu from '@/components/common/TabMenu';
import { likeService } from '@/services/like';
import { useCallback, useEffect, useState } from 'react';

import { productsService } from '@/services/products';
import { IProducts, IRecentProduct } from '@/types/product';
import { IBrandLikeList, ILikeList } from '@/types/like';
import ProductSave from '@/components/saved/ProductSave';
import BrandSave from '@/components/saved/BrandSave';
import RecentlySave from '@/components/saved/RecentlySave';

const TABS = [
  { id: 0, name: '상품' },
  { id: 1, name: '브랜드' },
  { id: 2, name: '최근 본 상품' },
];

// TODO 상품 리스트 페이지 완성되면 상세 페이지 이동할때
// localStorage로 주고 받도록 설정 필요
const RECENT_PRODUCT_IDS = ['5', '6', '7'];

const SavedPage = () => {
  const { addLike, deleteLike, getLikes, addBrandLike, deleteBrandLike, getBrandLikes } = likeService;
  const { getProductList, getRecentlyProductList } = productsService;
  const [selectTab, setSelectTab] = useState(1);
  const [productList, setProductList] = useState<IProducts[]>([]);
  const [likeList, setLikeList] = useState<ILikeList[]>([]);
  const [brandLikeList, setBrandLikeList] = useState<IBrandLikeList[]>([]);
  const [recentProducts, setRecentProducts] = useState<IRecentProduct[]>([]);

  const handleGetRecentlyProduct = useCallback(() => {
    const ids = RECENT_PRODUCT_IDS;
    const params = new URLSearchParams();
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
  }, [getRecentlyProductList]);

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

  const handleAddBrandLike = useCallback(
    (id: number) => {
      addBrandLike(id)
        .then((res) => {
          console.log('res ', res);
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [addBrandLike]
  );

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

  const initSave = useCallback(() => {
    handleProductList();
    handleGetLikes();
  }, [handleGetLikes, handleProductList]);

  const handleDeleteLike = useCallback(
    (id: number) => {
      const deleteId = likeList?.find((item) => item?.productId === id)?.id ?? 0;

      deleteLike(deleteId)
        .then((res) => {
          initSave();
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteLike, initSave, likeList]
  );

  const handleLikeAdd = useCallback(
    (productId: number) => {
      const likeCheck = likeList?.find((likeItem) => likeItem?.productId === productId);

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

  const onClickSave = (id: number) => {
    handleDeleteLike(id);
  };

  useEffect(() => {
    handleProductList();
  }, [handleProductList]);

  useEffect(() => {
    handleGetLikes();
  }, [handleGetLikes]);

  useEffect(() => {
    handleGetBrandLikes();
  }, [handleGetBrandLikes]);

  useEffect(() => {
    handleGetRecentlyProduct();
  }, [handleGetRecentlyProduct]);

  return (
    <section>
      <TabMenu tabs={TABS} selectedTab={selectTab} onTabSelect={setSelectTab} />
      {selectTab === 0 && <ProductSave likeList={likeList} productList={productList} onClickSave={onClickSave} />}
      {selectTab === 1 && <BrandSave brandLikeData={brandLikeList} onClickBookMark={handleDeleteBrandLike} />}
      {selectTab === 2 && (
        <RecentlySave recentProducts={recentProducts} likeList={likeList} onClickSaveAdd={handleLikeAdd} />
      )}
    </section>
  );
};

export default SavedPage;
