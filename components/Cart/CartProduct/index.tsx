'use client';

import ChipButton from '@/components/common/ChipButton';
import styles from './cartProduct.module.scss';
import Checkbox from '@/components/common/Checkbox';
import Link from 'next/link';
import Button from '@/components/common/Button';

const CartProduct = () => {
  return (
    <div>
      <section className={styles.item_select_bar}>
        <Checkbox />
        <ChipButton text="삭제" />
      </section>
      <Link href={'/'} className={styles.item_info_wrap}>
        <span className={styles.item_image}>이미지</span>
        <div className={styles.item_info}>
          <h3 className={styles.main_text}>메인 타이틀</h3>
          <p className={styles.sub_text}>서브타이틀</p>
          <p className={styles.option_text}>옵션</p>
        </div>
      </Link>
      <div className={styles.item_price}>
        <p className={styles.price_title}>상품금액</p>
        <p className={styles.price}>249,000원</p>
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
