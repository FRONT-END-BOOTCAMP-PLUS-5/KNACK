'use client';

import { useEffect, useMemo, useState } from 'react';
import BuyingList from '@/components/my/buying/BuyingList';
import { BuyingTabs } from '@/components/my/buying/BuyingTabs';
import requester from '@/utils/requester';
import { BuyingItem, Tab } from '@/types/order';
import { BuyingHistoryHeader } from '@/components/my/BuyingHistoryHeader';

export default function BuyingPage() {
    const [items, setItems] = useState();
    const [orderItems, setOrderItems] = useState<BuyingItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>('all');

    // 탭 → 서버 쿼리 변환(백엔드가 status 파라미터를 받는 구조일 때)
    const query = useMemo(() => {
        // 서버가 all/progress/done을 그대로 받지 않으면 여기서 매핑
        // e.g. progress → status=progress, done → status=done, all → (파라미터 생략)
        return tab === 'all' ? '' : `?status=${tab}`;
    }, [tab]);

    const handleTab = (tab: Tab) => {
        setTab(tab);
    };

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const resp = await requester.get(`/api/payments`);
                console.log(resp.data.payments);
                setItems(resp?.data.payments);
                setOrderItems(resp.data.payments.overallSummary)
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
            cancelled = true;
        };
    }, [query]);

    return (
        <div>
            <BuyingHistoryHeader />
            <BuyingTabs onTabSelect={handleTab} counts={{ all: orderItems?.total?.length, progress: orderItems?.inProgress?.length, done: orderItems?.completed?.length }} />
            {loading && <div style={{ padding: 16 }}>불러오는 중…</div>}
            {error && <div style={{ padding: 16, color: 'crimson' }}>{error}</div>}
            {!loading && !error && items && <BuyingList items={items} tab={tab} />}
        </div>
    );
}
