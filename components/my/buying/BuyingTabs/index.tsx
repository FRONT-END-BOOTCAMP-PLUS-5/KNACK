'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import styles from './tabs.module.scss';
import { Tab } from '@/types/order';

const TABS: { key: Tab; label: string }[] = [
    { key: 'all', label: '전체' },   // 스샷 라벨에 맞춤
    { key: 'progress', label: '진행 중' },
    { key: 'done', label: '종료' },
];

export function BuyingTabs({
    counts = { all: 0, progress: 0, done: 0 },
}: {
    counts?: { all: number; progress: number; done: number };
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const current = (searchParams.get('tab') as Tab) ?? 'progress';

    const getCount = (k: Tab) =>
        k === 'all' ? counts.all : k === 'progress' ? counts.progress : counts.done;

    return (
        <nav className={styles.tabs} role="tablist" aria-label="구매 상태">
            {TABS.map((t, i) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('tab', t.key);
                const href = `${pathname}?${params.toString()}`;
                const active = current === t.key;

                return (
                    <Link
                        key={t.key}
                        href={href}
                        role="tab"
                        aria-selected={active}
                        scroll={false}
                        className={`${styles.tab} ${active ? styles.active : ''} ${i === 1 ? styles.mid : ''}`}
                    >
                        <span className={styles.count} aria-hidden="true">
                            {getCount(t.key)}
                        </span>
                        <span className={styles.label}>{t.label}</span>
                        {active && <span className={styles.indicator} aria-hidden="true" />}
                    </Link>
                );
            })}
        </nav>
    );
}
