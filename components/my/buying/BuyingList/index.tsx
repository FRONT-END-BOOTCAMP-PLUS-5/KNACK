import React, { useMemo } from 'react';
import styles from './buyingList.module.scss';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { useRouter } from 'next/navigation';
import { Payment } from '@/types/payment';

export default function BuyingList({
    items,
    tab,
}: {
    items: { payments: Payment[] };
    tab: 'all' | 'progress' | 'done';
}) {
    const router = useRouter();

    // KST로 YY/MM/DD HH:mm 포맷
    const formatKST = (d?: string | Date | null) => {
        if (!d) return '';
        const dt = new Date(d);
        // KST 보정
        const kst = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
        const yy = String(kst.getUTCFullYear()).slice(2);
        const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(kst.getUTCDate()).padStart(2, '0');
        const hh = String(kst.getUTCHours()).padStart(2, '0');
        const min = String(kst.getUTCMinutes()).padStart(2, '0');
        return `${yy}/${mm}/${dd} ${hh}:${min}`;
    };

    // 탭 기준으로 결제단위 필터링 (내부 orders를 거른 후, 표시할 주문이 없으면 제외)
    const payments = useMemo(() => {
        const list = items?.payments ?? [];
        const filtered = list
            .map((p) => {
                let orders = p.orders ?? [];
                if (tab === 'progress') orders = orders.filter((o) => o.deliveryStatus !== 4);
                if (tab === 'done') orders = orders.filter((o) => o.deliveryStatus === 4);
                return { ...p, orders };
            })
        return filtered;
    }, [items, tab]);

    return (
        <section className={styles.buying_list_section}>
            {payments.map((payment) => {
                const displayDate = formatKST(payment.approvedAt ?? payment.createdAt);
                // 결제 상태 뱃지(선택): 모든 주문 완료면 '배송 완료', 아니면 '진행 중'
                const allDone = payment.orders.every((o) => o.deliveryStatus === 4);
                const paymentBadge = allDone ? '배송 완료' : '진행 중';

                return (
                    <article key={payment.id} className={styles.payment_block}>
                        {/* 결제 헤더: 결제번호 + 구매확정(승인) 날짜 */}
                        <header
                            className={styles.payment_header}
                            onClick={() => router.push(`/my/buying/${payment.id}`)}
                        >
                            <div className={styles.payment_left}>
                                <span className={styles.payment_number}>결제번호 {payment.paymentNumber}</span>
                            </div>
                            <div className={styles.payment_right}>
                                <span className={styles.payment_date}>{displayDate}</span>
                                <span className={styles.chevron} aria-hidden>›</span>
                            </div>
                        </header>

                        {/* 결제 내 상품들 */}
                        {payment.orders.map((order) => {
                            const statusText = order.deliveryStatus === 4 ? '배송 완료' : '배송 중';
                            const optionText =
                                order?.optionValue?.name ?? order?.optionValue?.value ?? '';

                            return (
                                <div
                                    key={order.id}
                                    className={styles.item_row}
                                    onClick={() => router.push(`/my/buying/${order.id}`)}
                                >
                                    <Image
                                        src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${order.product?.thumbnailImage ?? ''}`}
                                        alt=""
                                        width={80}
                                        height={80}
                                        className={styles.thumb}
                                    />
                                    <div className={styles.item_body}>
                                        <div className={styles.title_line}>
                                            <span className={styles.title}>{order.product?.korName ?? ''}</span>
                                        </div>
                                        {optionText && <div className={styles.option}>{optionText}</div>}
                                    </div>

                                    <div className={styles.status_area}>
                                        <div className={styles.badge}>{statusText}</div>
                                        {order.tracking ? (
                                            <button
                                                type="button"
                                                className={styles.tracking_link}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // 필요 시 실제 운송장 조회 URL로 교체
                                                    window.open(`/tracking/${order.id}`, '_blank');
                                                }}
                                            >
                                                배송조회
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </article>
                );
            })}
        </section>
    );
}
