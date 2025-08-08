'use client';

import Divider from '@/components/common/Divider';
import styles from './cartPage.module.scss';
import ChipButton from '@/components/common/ChipButton';
import Checkbox from '@/components/common/Checkbox';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import CartProduct from '@/components/cart/CartProduct';
import PaymentButton from '@/components/cart/PaymentButton';
import { cartService } from '@/services/cart';
import React, { useCallback, useEffect, useState } from 'react';
import { ICart } from '@/types/cart';
import { CART_INITIAL_VALUE, DELIVERY_DESCRIPTION_TEXT } from '@/constraint/cart';
import ConfirmModal from '@/components/common/ConfirmModal';
import BottomSheet from '@/components/common/BottomSheet';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import { STORAGE_PATHS } from '@/constraint/auth';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { getCart, removeCart, removesCart, upsertCart } = cartService;
  const { onOpen, onClose } = useBottomSheetStore();
  const router = useRouter();

  const [carts, setCarts] = useState<ICart[]>([]);
  const [selectCarts, setSelectCarts] = useState<ICart[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [multiDeleteOpen, setMultiDeleteOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState<ICart>(CART_INITIAL_VALUE);
  const [selectOptionId, setSelectOptionId] = useState<number>(0);

  const handleRemoveCart = () => {
    removeCart(selectedCart?.id)
      .then((res) => {
        if (res.result) {
          setSelectedCart(CART_INITIAL_VALUE);
          setDeleteOpen(false);
          initCart();
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  const handleMultiRemoveCart = () => {
    const ids = selectCarts?.map((item) => item.id);

    removesCart(ids)
      .then((res) => {
        setMultiDeleteOpen(false);
        setSelectCarts([]);
        initCart();
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  const handleOptionChange = async () => {
    if (selectedCart?.optionValueId === selectOptionId) return onClose();

    const updateData = {
      id: selectedCart?.id,
      count: selectedCart?.count,
      optionValueId: selectOptionId,
    };

    await upsertCart(updateData)
      .then((res) => {
        if (res.result) {
          // spinner 적용 필요
          setTimeout(() => {
            initCart();
            onClose();
          }, 300);
        }
      })
      .catch((error) => {
        onClose();
        console.log('error', error.message);
      });
  };

  const onClickMultiRemoveCart = () => {
    setMultiDeleteOpen(true);
  };

  const onClickRemoveCart = (selectCart: ICart) => {
    setDeleteOpen(true);
    setSelectedCart(selectCart);
  };

  const onClickOptionChange = (selectCart: ICart) => {
    onOpen();
    setSelectedCart(selectCart);
    setSelectOptionId(selectCart?.optionValueId);
  };

  const onClickPayment = () => {
    const checkoutData = selectCarts?.map((item) => {
      return {
        productId: item?.product?.id,
        quantity: 1,
        optionValueId: item?.optionValueId,
        deliveryMethod: 'normal',
      };
    });

    localStorage.setItem('checkout', JSON.stringify(checkoutData));

    router.push('/payments/checkout');
  };

  const addSelectCart = (selectData: ICart, checked: boolean) => {
    if (checked) {
      setSelectCarts((prev) => [...prev, selectData]);
    } else {
      setSelectCarts(selectCarts.filter((item) => item?.id !== selectData.id));
      setAllChecked(false);
    }
  };

  const handleAllCheckbox = (status: boolean) => {
    setAllChecked(status);
    if (status) setSelectCarts(carts);
    else setSelectCarts([]);
  };

  const initCart = useCallback(async () => {
    await getCart().then((res) => {
      setCarts(res.result);
    });
  }, [getCart]);

  useEffect(() => {
    if (carts?.length > 0) {
      setAllChecked(selectCarts.length === carts.length);
    }
  }, [selectCarts, carts]);

  useEffect(() => {
    initCart();
  }, [initCart]);

  return (
    <article className={styles.cart_wrap}>
      <section className={styles.all_select_bar}>
        <div className={styles.select_input_box}>
          <Checkbox id="allSelect" checked={allChecked} onChangeCheckbox={(status) => handleAllCheckbox(status)} />
          <label htmlFor="allSelect">전체 선택</label>
        </div>
        <ChipButton text="선택 삭제" onClick={onClickMultiRemoveCart} />
      </section>
      <Divider />
      <section>
        {carts?.length > 0 &&
          carts?.map((item, index) => (
            <React.Fragment key={item?.id + '_' + index}>
              <CartProduct
                cartData={item}
                selectCarts={selectCarts}
                optionOpen={onClickOptionChange}
                addSelectCart={addSelectCart}
                onClickDelete={onClickRemoveCart}
              />
              <Divider />
            </React.Fragment>
          ))}

        <section className={styles.select_order_info_wrap}>
          <h2 className={styles.select_order_title}>선택 주문정보</h2>
          <Divider height={1} paddingHorizontal={16} />
          <Flex paddingHorizontal={16} paddingVertical={12} gap={4} direction="column">
            <Flex justify="between" paddingVertical={3}>
              <Text size={1.4} color="gray1">
                총 상품금액
              </Text>
              <Text size={1.4} color="black1">
                {selectCarts?.reduce((acc, cur) => acc + (cur?.product?.price ?? 0), 0).toLocaleString()}원
              </Text>
            </Flex>
            <Flex justify="between" paddingVertical={3}>
              <Text size={1.4} color="gray1">
                총 배송비
              </Text>
              <Text size={1.4} color="black1">
                무료
              </Text>
            </Flex>
          </Flex>
          <Divider height={1} paddingHorizontal={16} />
          <Flex justify="between" paddingVertical={15} paddingHorizontal={16} align="center">
            <Text size={1.4} color="black1" weight={600}>
              총 예상 결제금액
            </Text>
            <Text size={1.6} color="black1" weight={700}>
              {selectCarts?.reduce((acc, cur) => acc + (cur?.product?.price ?? 0), 0).toLocaleString()}
            </Text>
          </Flex>
        </section>
        <Divider />
        <section className={styles.delivery_description_text}>
          {DELIVERY_DESCRIPTION_TEXT?.map((item) => (
            <Flex gap={6} key={item}>
              <Text size={1.3} color="black1">
                ㆍ
              </Text>
              <Text size={1.3} color="gray2">
                {item}
              </Text>
            </Flex>
          ))}
        </section>
        <Divider />
      </section>
      <PaymentButton selectCarts={selectCarts} onClickPayment={onClickPayment} />
      <ConfirmModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => handleRemoveCart()}>
        <Flex direction="column" align="center" gap={16}>
          <Text tag="h2" weight={700} size={1.8} color="black1">
            상품 삭제
          </Text>
          <Text tag="p" size={1.4} color="gray1">
            상품을 삭제 하시겠습니까?
          </Text>
        </Flex>
      </ConfirmModal>

      <ConfirmModal open={multiDeleteOpen} onClose={() => setMultiDeleteOpen(false)} onConfirm={handleMultiRemoveCart}>
        <Flex direction="column" align="center" gap={16}>
          <Text tag="h2" weight={700} size={1.8} color="black1">
            선택 상품 삭제
          </Text>
          <Text tag="p" size={1.4} color="gray1">
            선택하신 {selectCarts?.length ?? 0}개의 상품을 삭제 하시겠습니까?
          </Text>
        </Flex>
      </ConfirmModal>

      <BottomSheet>
        <Flex justify="center" paddingVertical={16}>
          <Text tag="h2" size={1.8} weight={600}>
            옵션 변경
          </Text>
        </Flex>
        <section className={styles.option_sheet_product}>
          <span className={styles.image}>
            <Image
              src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${selectedCart?.product?.thumbnailImage}`}
              width={56}
              height={56}
              alt="썸네일"
            />
          </span>
          <Flex direction="column" width="self" gap={2}>
            <Text size={1.4} color="black1">
              {selectedCart?.product?.korName}
            </Text>
            <Text size={1.3} color="gray1">
              {selectedCart?.product?.engName}
            </Text>
          </Flex>
        </section>
        <Divider height={1} />
        <section className={styles.option_flex_wrap}>
          {selectedCart?.product?.productOptionMappings[0]?.optionType?.optionValue?.map((item, index) => (
            <button
              key={index}
              className={`${styles.option_button} ${selectOptionId === item?.id && styles.active}`}
              onClick={() => setSelectOptionId(item?.id)}
            >
              {item?.name}
            </button>
          ))}
        </section>
        <div className={styles.option_change_button_wrap}>
          <Button size="large" style="black" text="확인" onClick={handleOptionChange} />
        </div>
      </BottomSheet>
    </article>
  );
};

export default CartPage;
