import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { CartRef, ICart } from '@/types/cart';
import requester from '@/utils/requester';
import { useCallback, useEffect, useState } from 'react';

export const useCart = () => {
  const { setStoreCarts } = useCartStore();
  const { setOnToast } = useToastStore();
  const [carts, setCarts] = useState<ICart[]>([]);
  const [message, setMessage] = useState('');

  const getCart = useCallback(async () => {
    await requester
      .get(`/api/cart`)
      .then((res) => {
        setCarts(res.data.result);
      })
      .catch((error) => {
        console.log('getCart-error', error.message);
      });
  }, []);

  const removeCart = async (id: number) => {
    await requester
      .delete(`/api/cart?id=${id}`)
      .then((res) => {
        if (res.data.result) {
          getCart();
        }
      })
      .catch((error) => {
        console.log('removeCart-error', error.message);
      });
  };

  const removesCart = useCallback(
    async (ids: number[]) => {
      await requester
        .post(`/api/cart/deletes`, { ids: ids })
        .then((res) => {
          if (res.data.result) {
            getCart();
          }
        })
        .catch((error) => {
          console.log('removesCart-error', error.message);
        });
    },
    [getCart]
  );

  const upsertCart = useCallback(
    async (updateData: CartRef) => {
      await requester
        .post(`/api/cart`, updateData)
        .then((res) => {
          if (res.data.message === '로그인이 필요합니다.') {
            return setMessage(res.data.message);
          }

          if (res.data.result) {
            setOnToast(true, '장바구니에 담겼어요!', '/cart');
            setStoreCarts(updateData);

            getCart();
          }
        })
        .catch((error) => {
          console.log('upsertCart-error', error.message);
        });
    },
    [getCart, setOnToast, setStoreCarts]
  );

  useEffect(() => {
    getCart();
  }, [getCart]);

  return {
    carts,
    removeCart,
    removesCart,
    upsertCart,
    message,
  };
};
