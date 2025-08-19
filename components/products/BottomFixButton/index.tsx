'use client';

import Image from 'next/image';
import styles from './bottomFixButton.module.scss';
import Text from '@/components/common/Text';

import SaveIcon from '@/public/icons/book_mark.svg';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import OptionBottomSheet from '../OptionBottomSheet';
import { IProduct } from '@/types/productDetail';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cartService } from '@/services/cart';

interface IProps {
  productData?: IProduct;
}

const BottomFixButton = ({ productData }: IProps) => {
  const router = useRouter();
  const { onOpen, onClose } = useBottomSheetStore();
  const { upsertCart } = cartService;

  const [selectOptionId, setSelectOptionId] = useState(0);
  const [deliveryOptionId, setDeliveryOption] = useState(0);

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
          onClose();
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  return (
    <>
      <div className={styles.bottom_fix_wrap}>
        <article className={styles.contents}>
          <div className={styles.icon_wrap}>
            <Image src={SaveIcon} width={18} height={18} alt="좋아요 아이콘" />
            <Text size={1.3} color="gray3" weight={600}>
              0
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
