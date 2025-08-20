import styles from './buyingFooter.module.scss';

export default function BuyingFooter({ onClickPayment }: { onClickPayment: () => void }) {
    return (
        <div className={styles.stickyCta}>
            <button className={styles.primaryBtn} onClick={onClickPayment}>구매 결정하기</button>
        </div>
    );
}
