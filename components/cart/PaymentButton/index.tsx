'use client';

import Button from '@/components/common/Button';
import styles from './paymentButton.module.scss';
import { ICart } from '@/types/cart';

interface IProps {
  selectCarts: ICart[];
  onClickPayment: (direct?: ICart | ICart[]) => void;
}

const PaymentButton = ({ selectCarts, onClickPayment }: IProps) => {
  const totalPrice = selectCarts?.reduce((acc, cur) => acc + (cur?.product?.price ?? 0), 0) ?? 0;

  return (
    <div className={styles.payment_button}>
      <div className={styles.button_width}>
        <Button
          text={`${totalPrice.toLocaleString()}원ㆍ총 ${selectCarts?.length ?? 0}건 주문하기`}
          size="large"
          style="orange"
          onClick={() => onClickPayment(selectCarts)}
        />
      </div>
    </div>
  );
};

export default PaymentButton;
