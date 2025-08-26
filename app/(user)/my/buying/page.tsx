'use client';

import { useEffect, useMemo, useState } from 'react';
import BuyingList from '@/components/my/buying/BuyingList';
import { BuyingTabs } from '@/components/my/buying/BuyingTabs';
import requester from '@/utils/requester';
import { FilterItem, Tab } from '@/types/order';
import { BuyingHistoryHeader } from '@/components/my/BuyingHistoryHeader';
import { Payment } from '@/types/payment';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function BuyingPage() {
    const [items, setItems] = useState<Payment[]>();
    const [orderItems, setOrderItems] = useState<FilterItem>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cancelled, setCancelled] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // 1) URL에서 탭 읽기 (유효성 체크 + 기본값)
    const tab: Tab = useMemo(() => {
        const t = searchParams.get('tab');
        return t === 'all' || t === 'progress' || t === 'done' ? (t as Tab) : 'progress';
    }, [searchParams]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);

                const resp = (await requester.get(`/api/payments`)).data.payments;
                setItems(resp?.payments);
                setOrderItems(resp.overallSummary)
            } catch (e) {
                console.error('Failed to fetch orders:', e);
                if (!cancelled) {
                    setItems([]);
                    setError('주문을 불러오지 못했어요.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            setCancelled(true);
        };
    }, [cancelled]);

    const filteredPayments = useMemo(() => {
        if (!items?.length) return [];
        switch (tab) {
            case 'progress':
                return items.filter(p => (p.orders ?? []).some(o => Number(o.deliveryStatus) !== 4));
            case 'done':
                return items.filter(p => (p.orders ?? []).some(o => Number(o.deliveryStatus) === 4));
            default:
                return items;
        }
    }, [items, tab]);

    // 3) 탭 변경 시 URL만 바꾸는 핸들러 (BuyingTabs가 필요로 할 경우)
    const handleTabSelect = (next: Tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', next);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div>
            <BuyingHistoryHeader />
            <BuyingTabs onTabSelect={handleTabSelect} counts={{ all: orderItems?.total?.length ?? 0, progress: orderItems?.inProgress?.length ?? 0, done: orderItems?.completed?.length ?? 0 }} />
            {loading && <div style={{ padding: 16 }}>불러오는 중…</div>}
            {error && <div style={{ padding: 16, color: 'crimson' }}>{error}</div>}
            {!loading && !error && items && <BuyingList items={filteredPayments} />}
        </div>
    );
}
