import Image from 'next/image';
import styles from './buyingHistoryHeader.module.scss';
export function BuyingHistoryHeader() {
    return (
        <header className={styles.header}>
            <button className={styles.back} aria-label="뒤로가기" onClick={() => history.back()}><Image src="/icons/header-back.svg" alt="뒤로가기" width={24} height={24} /></button>
            <h1>구매 내역</h1>
            <div className={styles.menu} aria-hidden />
        </header>
    );
}
