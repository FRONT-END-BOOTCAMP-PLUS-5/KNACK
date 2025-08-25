import Image from 'next/image';
import styles from './buyingHistoryHeader.module.scss';
import Link from 'next/link';
export function BuyingHistoryHeader() {
    return (
        <header className={styles.header}>
            <Link href="/my" className={styles.back} aria-label="뒤로가기">
                <Image src="/icons/header-back.svg" alt="뒤로가기" width={24} height={24} />
            </Link>
            <h1>구매 내역</h1>
            <div className={styles.menu} aria-hidden />
        </header >
    );
}
