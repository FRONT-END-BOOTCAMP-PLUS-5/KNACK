'use client';

import TabMenu from '@/components/common/TabMenu';
import { likeService } from '@/services/like';
import { useCallback, useEffect, useState } from 'react';

import { productsService } from '@/services/products';
import { IProducts } from '@/types/product';
import { IBrandLikeList, ILikeList } from '@/types/like';
import ProductSave from '@/components/saved/ProductSave';
import BrandSave from '@/components/saved/BrandSave';

const TABS = [
  { id: 0, name: '상품' },
  { id: 1, name: '브랜드' },
  { id: 2, name: '최근 본 상품' },
];

const SavedPage = () => {
  const { addLike, deleteLike, getLikes, addBrandLike, deleteBrandLike, getBrandLikes } = likeService;
  const { getProductList } = productsService;
  const [selectTab, setSelectTab] = useState(1);
  const [productList, setProductList] = useState<IProducts[]>([]);
  const [likeList, setLikeList] = useState<ILikeList[]>([]);
  const [brandLikeList, setBrandLikeList] = useState<IBrandLikeList[]>([]);

  const handleGetBrandLikes = useCallback(() => {
    getBrandLikes()
      .then((res) => {
        console.log('res ', res);
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

  const handleAddBrandLike = useCallback(() => {
    const brandId = 2;

    addBrandLike(brandId)
      .then((res) => {
        console.log('res ', res);
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [addBrandLike]);

  const handleDeleteBrandLike = useCallback(
    (id: number) => {
      deleteBrandLike(id)
        .then((res) => {
          console.log('res ', res);
          initLikeBrand();
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteBrandLike, initLikeBrand]
  );

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

  useEffect(() => {
    handleGetBrandLikes();
  }, [handleGetBrandLikes]);

  return (
    <section>
      <TabMenu tabs={TABS} selectedTab={selectTab} onTabSelect={setSelectTab} />
      {selectTab === 0 && <ProductSave likeList={likeList} productList={productList} onClickSave={onClickSave} />}
      {selectTab === 1 && <BrandSave brandLikeData={brandLikeList} onClickBookMark={handleDeleteBrandLike} />}
    </section>
  );
};

export default SavedPage;
