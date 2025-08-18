import styles from './buyingFooter.module.scss';

export default function BuyingFooter() {
    return (
        <div className={styles.stickyCta}>
            <button className={styles.primaryBtn}>구매 결정하기</button>
        </div>
    );
}