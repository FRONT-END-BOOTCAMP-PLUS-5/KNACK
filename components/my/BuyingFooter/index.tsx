'use client';

import styles from './buyingFooter.module.scss';

type Props = {
    onClickPayment: () => void;
    disabled?: boolean;
};

export default function BuyingFooter({ onClickPayment, disabled }: Props) {
    return (
        <div className={styles.stickyCta}>
            <button
                type="button"
                className={styles.primaryBtn}
                onClick={onClickPayment}
                disabled={disabled}
                aria-disabled={disabled}
            >
                구매 결정하기
            </button>
        </div>
    );
}