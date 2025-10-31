import { useToastStore } from '@/store/toastStore';
import { ILikeList } from '@/types/like';
import requester from '@/utils/requester';
import { useEffect, useState } from 'react';

export const useSavedProduct = () => {
  const { setOnToast } = useToastStore();

  const [likeList, setLikeList] = useState<ILikeList[]>([]);

  const getLikes = async () => {
    await requester
      .get(`api/likes`)
      .then((res) => {
        setLikeList(res.data.result);
      })
      .catch((error) => {
        console.log('getLikes-error', error.message);
      });
  };

  const likeAdd = async (productId: number) => {
    await requester
      .post(`api/likes`, { productId })
      .then((res) => {
        if (res.status === 200) {
          setOnToast(true, '잘 담겼어요!');
          getLikes();
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  const deleteLike = async (productId: number) => {
    await requester
      .delete(`api/likes`, { data: { id: productId } })
      .then((res) => {
        if (res.status === 200) {
          getLikes();
          setOnToast(true, '삭제 되었어요!');
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  useEffect(() => {
    getLikes();
  }, []);

  return { likeList, likeAdd, getLikes, deleteLike };
};
