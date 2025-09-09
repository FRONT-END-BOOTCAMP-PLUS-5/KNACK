'use client';

import { useEffect, useMemo, useState } from 'react';
import BuyingList from '@/components/my/buying/BuyingList';
import { BuyingTabs } from '@/components/my/buying/BuyingTabs';
import requester from '@/utils/requester';
import { Tab } from '@/types/order';
import { BuyingHistoryHeader } from '@/components/my/BuyingHistoryHeader';
import { IOrderItem, IPaymentList, Payment } from '@/types/payment';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface IOrderStatus {
  all: number;
  deliverying: number;
  complete: number;
}

export default function BuyingPage() {
  const [items, setItems] = useState<Payment[]>();
  const [orderStatus, setOrderStatus] = useState<IOrderStatus>({ all: 0, deliverying: 0, complete: 0 });
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

        const response = (await requester.get(`/api/payments`)).data.payments;

        setItems(response?.result);

        const orders = response?.result.flatMap((item: IPaymentList) => item?.orders);
        const complete = orders.filter((item: IOrderItem) => item.deliveryStatus === 4);
        const deliverying = orders.filter((item: IOrderItem) => item.deliveryStatus !== 4);

        setOrderStatus({
          all: orders.length,
          complete: complete.length,
          deliverying: deliverying.length,
        });
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
        return items.filter((p) => (p.orders ?? []).some((o) => Number(o.deliveryStatus) !== 4));
      case 'done':
        return items.filter((p) => (p.orders ?? []).some((o) => Number(o.deliveryStatus) === 4));
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
      <BuyingTabs
        onTabSelect={handleTabSelect}
        counts={{
          all: orderStatus.all ?? 0,
          progress: orderStatus.deliverying ?? 0,
          done: orderStatus.complete ?? 0,
        }}
      />

      {loading && <div style={{ padding: 16 }}>불러오는 중…</div>}
      {error && <div style={{ padding: 16, color: 'crimson' }}>{error}</div>}
      {!loading && !error && items && <BuyingList items={filteredPayments} />}
    </div>
  );
}
