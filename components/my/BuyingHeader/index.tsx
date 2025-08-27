import Image from 'next/image';
import styles from './buyingHeader.module.scss';
import { useRouter } from 'next/navigation';

export function BuyingHeader() {
    const router = useRouter();
    return (
        <header className={styles.header}>
            <button className={styles.back} aria-label="뒤로가기" onClick={() => router.push('/my/buying?tab=all')}><Image src="/icons/header-back.svg" alt="뒤로가기" width={24} height={24} /></button>
            <h1>구매 진행 중</h1>
            <div className={styles.menu} aria-hidden />
        </header>
    );
}
