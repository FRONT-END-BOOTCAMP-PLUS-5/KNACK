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
import { cartService } from '@/services/cart';
import { likeService } from '@/services/like';
import { ILikeList } from '@/types/like';
import { useCartStore } from '@/store/cartStore';
import { useLikeStore } from '@/store/likeStore';
import LikeToast from '../LikeToast';

interface IProps {
  productData?: IProduct;
}

const BottomFixButton = ({ productData }: IProps) => {
  const router = useRouter();
  const { onOpen, onClose } = useBottomSheetStore();
  const { upsertCart } = cartService;
  const { addLike, deleteLike, getLikes } = likeService;
  const { cartCount, setCartCount } = useCartStore();
  const { productDetailLike: storeLike, setProductDetailLike: setStoreLike } = useLikeStore();

  const [selectOptionId, setSelectOptionId] = useState(0);
  const [deliveryOptionId, setDeliveryOption] = useState(0);
  const [likedCheck, setLikedCheck] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const onClickNowBuy = () => {
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

  const onClickCart = () => {
    if (selectOptionId === 0) return alert('옵션을 선택해주세요.');

    const cardData = {
      count: 1,
      optionValueId: selectOptionId,
      productId: productData?.id,
      id: 0, // upsert 이므로 없는 아이디를 넣어서 insert
    };

    upsertCart(cardData)
      .then((res) => {
        if (res.status === 200) {
          alert('장바구니에 담았어요.');
          setCartCount(cartCount + 1);
          onClose();
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  const handleGetLikes = useCallback(() => {
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
  }, [getLikes, productData?._count?.productLike, productData?.id, setStoreLike]);

  const handleDeleteLike = useCallback(
    (id: number) => {
      deleteLike(id)
        .then((res) => {
          if (res.status === 200) {
            alert('취소완료!');
            setStoreLike(storeLike.count - 1, false);
            setLikedCheck(!likedCheck);
          }
        })
        .catch((error) => {
          console.log('error', error.message);
        });
    },
    [deleteLike, likedCheck, setStoreLike, storeLike.count]
  );

  const handleLikeAdd = useCallback(
    (productId: number) => {
      if (likedCheck) {
        handleDeleteLike(productId);
      } else {
        addLike(productId)
          .then((res) => {
            if (res.status === 200) {
              setStoreLike(storeLike.count + 1, true);
              setToastOpen(true);
              setLikedCheck(!likedCheck);
            }
          })
          .catch((error) => {
            console.log('error', error.message);
          });
      }
    },
    [addLike, handleDeleteLike, likedCheck, storeLike, setStoreLike]
  );

  useEffect(() => {
    handleGetLikes();
  }, [handleGetLikes]);

  return (
    <>
      <div className={styles.bottom_fix_wrap}>
        <article className={styles.contents}>
          <div className={styles.icon_wrap}>
            <button className={styles.like_button} onClick={() => handleLikeAdd(productData?.id ?? 0)}>
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
      <LikeToast
        open={toastOpen}
        setOpen={() => setToastOpen(false)}
        message="관심 상품에 저장되었습니다."
        link="/saved?tab=product"
      />
    </>
  );
};

export default BottomFixButton;
