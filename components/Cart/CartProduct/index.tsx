'use client';

import ChipButton from '@/components/common/ChipButton';
import styles from './cartProduct.module.scss';
import Checkbox from '@/components/common/Checkbox';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { ICart } from '@/types/cart';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';

interface IProps {
  cartData: ICart;
  allChecked: boolean;
  selectCarts: ICart[];
  onClickDelete: () => void;
  addSelectCart: (selectData: ICart, checked: boolean) => void;
}

const CartProduct = ({ cartData, allChecked, selectCarts, addSelectCart, onClickDelete }: IProps) => {
  const { korName, engName, thumbnailImage, price } = cartData.product;

  return (
    <div>
      <section className={styles.item_select_bar}>
        <Checkbox
          checked={
            allChecked === true || selectCarts.filter((item) => item.id === cartData.id).length > 0 ? true : null
          }
          onChangeCheckbox={(status) => addSelectCart(cartData, status)}
        />
        <ChipButton text="삭제" onClick={onClickDelete} />
      </section>
      <Link href={'/'} className={styles.item_info_wrap}>
        <span className={styles.item_image}>
          <Image
            src={`${STORAGE_PATHS.PREFIX}/${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${thumbnailImage}`}
            alt="상품 썸네일"
            width={300}
            height={300}
          />
        </span>
        <div className={styles.item_info}>
          <h3 className={styles.main_text}>{korName}</h3>
          <p className={styles.sub_text}>{engName}</p>
          <p className={styles.option_text}>
            {cartData?.productOptionMapping?.optionType?.name} /{' '}
            {cartData?.productOptionMapping?.optionType?.optionValue[0].name}
          </p>
        </div>
      </Link>
      <div className={styles.item_price}>
        <p className={styles.price_title}>상품금액</p>
        <p className={styles.price}>{price.toLocaleString()}원</p>
      </div>
      <div className={styles.delivery_price}>
        <p className={styles.delivery_title}>배송비</p>
        <p className={styles.price}>무료</p>
      </div>
      <section className={styles.button_wrap}>
        <Button text="옵션/배송 변경" />
        <Button text="바로 주문" style="black" />
      </section>
    </div>
  );
};

export default CartProduct;
