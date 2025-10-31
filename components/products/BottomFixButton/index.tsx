'use client';

import Image from 'next/image';
import styles from './bottomFixButton.module.scss';
import Text from '@/components/common/Text';

import SaveIcon from '@/public/icons/book_mark.svg';
import SaveOnIcon from '@/public/icons/book_mark_active.svg';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import OptionBottomSheet from '../OptionBottomSheet';
import { IProduct } from '@/types/productDetail';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { likeService } from '@/services/like';
import { ILikeList } from '@/types/like';
import { useCartStore } from '@/store/cartStore';
import { useLikeStore } from '@/store/likeStore';
import { useUserStore } from '@/store/userStore';
import { useToggleProductLike } from '@/hooks/search/useToggleProductLike';
import { useToastStore } from '@/store/toastStore';
import { useCart } from '@/hooks/cart/useCart';
import { CartRef } from '@/types/cart';

interface IProps {
  productData?: IProduct;
}

const BottomFixButton = ({ productData }: IProps) => {
  const router = useRouter();

  const { upsertCart, message } = useCart();
  const { getLikes } = likeService;
  const { mutate: toggleProductLike, isPending } = useToggleProductLike();

  const { onOpen, onClose } = useBottomSheetStore();
  const { storeCarts } = useCartStore();
  const { productDetailLike: storeLike, setProductDetailLike: setStoreLike } = useLikeStore();
  const { user } = useUserStore();
  const { setOnToast } = useToastStore();

  const [selectOptionId, setSelectOptionId] = useState(0);
  const [deliveryOptionId, setDeliveryOption] = useState(0);
  const [likedCheck, setLikedCheck] = useState(false);

  const onClickNowBuy = () => {
    if (!user?.id) {
      return router.push('/login');
    }

    if (!selectOptionId || selectOptionId === 0) {
      return setOnToast(true, '옵션을 선택해주세요.');
    }

    const checkoutData = [
      {
        productId: productData?.id,
        quantity: 1,
        optionValueId: selectOptionId,
        deliveryMethod: deliveryOptionId === 0 ? 'past' : 'normal',
      },
    ];

    localStorage.setItem('checkout', JSON.stringify(checkoutData));

    router.push('/payments/checkout');
  };

  const onClickCart = async () => {
    if (selectOptionId === 0) return setOnToast(true, '옵션을 선택해주세요.');

    const cartData: CartRef = {
      count: 1,
      optionValueId: selectOptionId,
      productId: productData?.id ?? 0,
      id: 0, // upsert 이므로 없는 아이디를 넣어서 insert
    };

    const cartDuplicate = storeCarts.find(
      (item) => item.optionValueId === selectOptionId && item.product?.id === productData?.id
    );

    if (cartDuplicate) return setOnToast(true, '이미 장바구니에 담긴 상품이에요!');

    await upsertCart(cartData);

    if (message === '로그인이 필요합니다.') {
      return router.push('/login');
    }
    onClose();
  };

  const handleGetLikes = useCallback(() => {
    if (!user?.id) return;
    getLikes()
      .then((res) => {
        if (res.status === 200) {
          const check = res.result.some((item: ILikeList) => item?.product?.id === productData?.id);

          setLikedCheck(check);
          setStoreLike(productData?._count?.productLike ?? 0, check);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getLikes, productData?._count?.productLike, productData?.id, setStoreLike, user]);

  const handleLikeAdd = useCallback(
    (productId: number) => {
      if (!user?.id) return router.push('/login');
      if (likedCheck) {
        toggleProductLike({ isLiked: true, id: productId });
        setStoreLike(storeLike.count - 1, false);
        setLikedCheck(!likedCheck);
      } else {
        toggleProductLike({ isLiked: false, id: productId });

        setStoreLike(storeLike.count + 1, true);
        setOnToast(true, '관심 상품에 저장되었어요!', '/saved?tab=product');
        setLikedCheck(!likedCheck);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [likedCheck, storeLike, setStoreLike, toggleProductLike, user]
  );

  useEffect(() => {
    handleGetLikes();
  }, [handleGetLikes]);

  return (
    <>
      <div className={styles.bottom_fix_wrap}>
        <article className={styles.contents}>
          <div className={styles.icon_wrap}>
            <button
              className={styles.like_button}
              disabled={isPending}
              onClick={() => handleLikeAdd(productData?.id ?? 0)}
            >
              <Image src={storeLike.status ? SaveOnIcon : SaveIcon} width={18} height={18} alt="좋아요 아이콘" />
            </button>
            <Text size={1.3} color="gray3" weight={600}>
              {storeLike.count}
            </Text>
          </div>
          <button className={styles.buy_button} onClick={onOpen}>
            <Text className={styles.but_text} size={1.5} color="white" weight={700}>
              구매
            </Text>
            <Text className={styles.price} size={1.5} color="white" weight={600} paddingLeft={12}>
              {productData?.price?.toLocaleString()}원
            </Text>
          </button>
        </article>
      </div>
      <OptionBottomSheet
        productData={productData}
        selectOptionId={selectOptionId}
        deliveryOptionId={deliveryOptionId}
        onClickBuy={onClickNowBuy}
        onClickCart={onClickCart}
        setSelectOptionId={setSelectOptionId}
        setDeliveryOption={setDeliveryOption}
      />
    </>
  );
};

export default BottomFixButton;
