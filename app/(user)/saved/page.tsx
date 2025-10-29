'use client';

import TabMenu from '@/components/common/TabMenu';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import ProductSave from '@/components/saved/ProductSave';
import BrandSave from '@/components/saved/BrandSave';
import RecentlySave from '@/components/saved/RecentlySave';
import { TABS } from '@/constraint/saved';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useSavedBrand } from '@/hooks/saved/useSavedBrand';
import { useSavedProduct } from '@/hooks/saved/useSavedProduct';
import { useSavedRecent } from '@/hooks/saved/useSavedRecent';

interface SAVED_TABS {
  product: string;
  brand: string;
  recent: string;
}

const SavedPage = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { brandLikeList, deleteBrandLike } = useSavedBrand();
  const { likeList, likeAdd, deleteLike } = useSavedProduct();
  const { recentProducts, getRecentlyProductList } = useSavedRecent();

  const [selectTab, setSelectTab] = useState(0);

  const handleLikeAdd = useCallback(
    (e: MouseEvent<HTMLButtonElement>, productId: number) => {
      e.preventDefault();
      if (!user?.id) return router.push('/login');
      const likeCheck = likeList?.find((likeItem) => likeItem?.product?.id === productId);

      if (likeCheck) {
        deleteLike(productId);
      } else {
        likeAdd(productId);
      }
    },
    [deleteLike, likeAdd, likeList, router, user?.id]
  );

  const onClickSave = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();

    deleteLike(id);
  };

  useEffect(() => {
    const storage = localStorage.getItem('recent') && JSON.parse(localStorage.getItem('recent') ?? '');

    const params = new URLSearchParams();

    if (!storage) return;

    storage.forEach((id: string) => params.append('id', id));

    getRecentlyProductList(storage);
  }, [getRecentlyProductList]);

  useEffect(() => {
    const tabs = { product: 0, brand: 1, recent: 2 };

    const params = (searchParams.get('tab') as keyof SAVED_TABS) ?? 'product';

    setSelectTab(tabs[params]);
  }, [searchParams]);

  return (
    <section>
      <TabMenu tabs={TABS} selectedTab={selectTab} onTabSelect={setSelectTab} />
      {selectTab === 0 && <ProductSave likeList={likeList} onClickSave={onClickSave} />}
      {selectTab === 1 && <BrandSave brandLikeData={brandLikeList} onClickBookMark={deleteBrandLike} />}
      {selectTab === 2 && (
        <RecentlySave recentProducts={recentProducts} likeList={likeList} onClickSaveAdd={handleLikeAdd} />
      )}
    </section>
  );
};

export default SavedPage;
