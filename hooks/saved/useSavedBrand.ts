import { useToastStore } from '@/store/toastStore';
import { IBrandLikeList } from '@/types/like';
import requester from '@/utils/requester';
import { useCallback, useEffect, useState } from 'react';

export const useSavedBrand = () => {
  const { setOnToast } = useToastStore();

  const [brandLikeList, setBrandLikeList] = useState<IBrandLikeList[]>([]);

  const getBrandLikes = async () => {
    await requester
      .get(`api/brand-likes`)
      .then((res) => {
        setBrandLikeList(res.data);
      })
      .catch((error) => {
        console.log('getBrandLikes-error', error.message);
      });
  };

  const deleteBrandLike = useCallback(
    async (id: number) => {
      await requester
        .delete(`api/brand-likes`, { data: { id: id } })
        .then((res) => {
          if (res.status === 200) {
            getBrandLikes();
            setOnToast(true, '삭제 되었어요!');
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [setOnToast]
  );

  useEffect(() => {
    getBrandLikes();
  }, []);

  return {
    brandLikeList,
    deleteBrandLike,
  };
};
