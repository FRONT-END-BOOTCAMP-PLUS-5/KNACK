'use client';

import Button from '@/components/common/Button';
import styles from './paymentButton.module.scss';

const PaymentButton = () => {
  return (
    <div className={styles.payment_button}>
      <div className={styles.button_width}>
        <Button text="422,300원ㆍ총 2건 주문하기" size="large" style="orange" />
      </div>
    </div>
  );
};

export default PaymentButton;
