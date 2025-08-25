import React, { useMemo } from 'react';
import styles from './buyingList.module.scss';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { useRouter } from 'next/navigation';
import { Payment } from '@/types/payment';
import { formatKST } from '@/utils/orders';

export default function BuyingList({ items }: { items: Payment[] }) {
    const router = useRouter();

    return (
        <section className={styles.buying_list_section}>
            {items.map((payment) => {
                const displayDate = formatKST(payment.approvedAt ?? payment.createdAt);
                // 빈 배열은 완료로 보지 않도록 가드
                const allDone =
                    payment.orders.length > 0 &&
                    payment.orders.every((o) => Number(o.deliveryStatus) === 4);

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
