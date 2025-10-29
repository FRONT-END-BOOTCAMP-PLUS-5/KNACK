import { IRecentProduct } from '@/types/product';
import requester from '@/utils/requester';
import { useState } from 'react';

export const useSavedRecent = () => {
  const [recentProducts, setRecentProducts] = useState<IRecentProduct[]>([]);

  const getRecentlyProductList = async (ids: string[]) => {
    if (!ids) return;

    await requester
      .get(`api/products/recent?${ids}`)
      .then((res) => {
        if (res.status === 200) {
          const sortedProducts = ids
            .map((id) => res.data.find((product: IRecentProduct) => product.id === Number(id)))
            .filter((product) => product !== undefined);

          setRecentProducts(sortedProducts);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  return {
    recentProducts,
    getRecentlyProductList,
  };
};
