'use client';

import requester from '@/utils/requester';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './orderPage.module.scss';
import { computeTotalsFromOrders } from '@/utils/orders';
import { PaymentData, ReceiptItem } from '@/types/payment';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const formatWon = (n: number) => new Intl.NumberFormat('ko-KR').format(Math.max(0, Math.round(n)));

  const fmtDate = (d: Date) =>
    `${d.getFullYear().toString().slice(2)}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(
      2,
      '0'
    )} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await requester.get(`/api/payments/${id}`);
        const payment = data.payment.result;

        console.log('data', data);

        // ✅ totals 재계산
        const totals = computeTotalsFromOrders(data.orders);

        // ✅ 결제정보 병합 (서버값이 있으면 유지하고, totals는 재계산값으로 덮어씀)
        const merged: PaymentData = {
          ...payment,
          totals,
          paymentNumber: payment?.paymentNumber,
        };

        setItems(payment?.orders);
        setPaymentData(merged);
      } catch (e) {
        console.error('Failed to fetch payment data:', e);
      }
    })();
  }, [id]);

  // ✅ 문자열 → Date
  const transactedAt = useMemo(() => {
    const a = paymentData?.approvedAt;
    return a ? new Date(a) : new Date();
  }, [paymentData?.approvedAt]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back_btn} aria-label="뒤로가기" onClick={() => router.push('/my/buying?tab=all')}>
          <Image src="/icons/header-back.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1>결제 내역 상세</h1>
        <div className={styles.header_spacer} />
      </header>
      <div className={styles.page}>
        {/* 상단 헤더 */}

        {/* 결제번호 */}
        <div className={styles.meta_row_2}>
          <Text size={1.2} weight={600}>
            결제번호
          </Text>
          <Text size={1.2} weight={600}>
            {paymentData?.paymentNumber}
          </Text>
        </div>

        {/* 아이템 리스트 */}
        <section className={styles.card}>
          {items.map((item) => (
            <article key={item.id} className={styles.item_row} onClick={() => router.push(`/my/buying/${item.id}`)}>
              <Image
                src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item?.thumbnailImage}`}
                width={80}
                height={80}
                alt=""
                className={styles.thumb}
              />
              <div className={styles.item_body}>
                <div className={styles.item_top}>
                  <Text size={1.2} color="gray1">
                    주문번호 {item.id}
                  </Text>
                  {item?.deliveryStatus && <span className={styles.badge}>{item?.deliveryStatus}</span>}
                </div>
                <div className={styles.title_line}>
                  <span className={styles.title}>{item?.engName}</span>
                  <span className={styles.chevron} aria-hidden>
                    &gt;
                  </span>
                </div>
                <Text size={1.2} weight={600}>
                  {item?.optionValue}
                </Text>
              </div>
            </article>
          ))}
        </section>

        {/* 최초 결제금액 카드 */}
        <section className={styles.total_card}>
          <Text size={1.6} weight={600} marginBottom={8}>
            최종 결제금액
          </Text>
          <Flex justify="end">
            <Text size={2} weight={600}>
              {formatWon(paymentData?.price ?? 0)}원
            </Text>
          </Flex>
        </section>

        {/* 금액 상세 */}
        <section className={styles.detail_card}>
          <Flex justify="between" paddingVertical={3}>
            <Text size={1.4}>총 구매가</Text>
            <div className={styles.value_strong}>{formatWon(items?.reduce((acc, cur) => acc + cur.price, 0))}원</div>
          </Flex>
          <Flex justify="between" paddingVertical={3}>
            <Text size={1.4} color="gray2">
              총 배송비
            </Text>
            <div className={styles.value}>{'-'}</div>
          </Flex>
          <Flex justify="between" paddingVertical={3}>
            <Text size={1.4} color="gray2">
              총 쿠폰 사용
            </Text>
            <div className={styles.value}>{'-'}</div>
          </Flex>
          <Flex justify="between" paddingVertical={3}>
            <Text size={1.4} color="gray2">
              총 포인트 사용
            </Text>
            <div className={styles.value}>{'-'}</div>
          </Flex>
        </section>

        {/* 거래 일시 */}
        <section className={styles.meta_group}>
          <Flex justify="between">
            <Text size={1.4}>거래 일시</Text>
            <Text size={1.4}>{fmtDate(transactedAt)}</Text>
          </Flex>
        </section>

        <Flex direction="column" paddingHorizontal={16} paddingVertical={12} gap={6}>
          <Text size={1.6} weight={600} marginTop={2}>
            결제정보
          </Text>
          <Text size={1.2} color="gray1">
            체결 후 결제 정보 변경은 불가하며, 할부 전환은 카드사 문의 바랍니다.
          </Text>
          <Text>{paymentData?.method}</Text>
        </Flex>
      </div>
    </div>
  );
}
