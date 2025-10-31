import { IRecentProduct } from '@/types/product';
import requester from '@/utils/requester';
import { useCallback, useEffect, useState } from 'react';

export const useSavedRecent = () => {
  const [recentProducts, setRecentProducts] = useState<IRecentProduct[]>([]);
  const [mainRecentProducts, setMainRecentProducts] = useState<IRecentProduct[][]>([]);

  const conversionArray = (value: IRecentProduct[], size: number) => {
    return value.reduce<IRecentProduct[][]>((acc, _, i) => {
      if (i % size === 0) {
        acc.push(value.slice(i, i + size));
      }
      return acc;
    }, []);
  };

  const getRecentlyProductList = useCallback(async (ids: string) => {
    if (!ids) return;

    await requester
      .get(`api/products/recent?${ids.toString()}`)
      .then((res) => {
        if (res.status === 200) {
          setRecentProducts(res.data.result);
          setMainRecentProducts(conversionArray(res.data.result, 2));
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, []);

  useEffect(() => {
    const storage = localStorage.getItem('recent') && JSON.parse(localStorage.getItem('recent') ?? '');

    const params = new URLSearchParams();

    if (!storage) return;

    storage.forEach((id: string) => params.append('id', id));

    getRecentlyProductList(params.toString());
  }, [getRecentlyProductList]);

  return {
    recentProducts,
    mainRecentProducts,
  };
};
