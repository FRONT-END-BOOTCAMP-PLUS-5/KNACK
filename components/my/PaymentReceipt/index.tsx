'use client';
import React from 'react';
import styles from './paymentReceipt.module.scss';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { useRouter } from 'next/navigation';
import { Info, Item, Totals } from '@/types/payment';

export default function PaymentReceipt({
    items,
    totals,
    info,
}: {
    items: Item[];
    totals: Totals;
    info: Info;
}) {
    const router = useRouter();
    const formatWon = (n: number) =>
        new Intl.NumberFormat('ko-KR').format(Math.max(0, Math.round(n)));

    const fmtDate = (d: Date) =>
        `${d.getFullYear().toString().slice(2)}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
            d.getDate()
        ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    return (
        <>
            <header className={styles.header}>
                <button className={styles.back_btn} aria-label="뒤로가기" onClick={() => router.push('/my/buying?tab=all')}>
                    <Image src="/icons/header-back.svg" alt="뒤로가기" width={24} height={24} />
                </button>
                <h1>결제 내역 상세</h1>
                <div className={styles.header_spacer} />
            </header >
            <div className={styles.page}>
                {/* 상단 헤더 */}


                {/* 결제번호 */}
                <div className={styles.meta_row_2}>
                    <span className={styles.meta_label}>결제번호</span>
                    <span className={styles.meta_value}>{info.paymentNumber}</span>
                </div>

                {/* 아이템 리스트 */}
                <section className={styles.card}>
                    {items.map((item) => (
                        <article key={item.id} className={styles.item_row} onClick={() => router.push(`/my/buying/${item.id}`)}>
                            <Image src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item.imageUrl}`} width={80} height={80} alt="" className={styles.thumb} />
                            <div className={styles.item_body}>
                                <div className={styles.item_top}>
                                    <span className={styles.order_number}>주문번호 {item.id}</span>
                                    {item.status && <span className={styles.badge}>{item.status}</span>}
                                </div>
                                <div className={styles.title_line}>
                                    <span className={styles.title}>{item.title}</span>
                                    <span className={styles.chevron} aria-hidden>
                                        &gt;
                                    </span>
                                </div>
                                <div className={styles.option}>{item.optionText}</div>
                            </div>
                        </article>
                    ))}
                </section>

                {/* 최초 결제금액 카드 */}
                <section className={styles.total_card}>
                    <div className={styles.total_label}>최초 결제금액</div>
                    <div className={styles.total_value}><span>{formatWon(totals.total)}원</span></div>
                </section>

                {/* 금액 상세 */}
                <section className={styles.detail_card}>
                    <div className={styles.row}>
                        <div className={styles.label}>총 구매가</div>
                        <div className={styles.value_strong}>{formatWon(totals.subtotal)}원</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>총 배송비</div>
                        <div className={styles.value}>{totals.shippingFee ? `${formatWon(totals.shippingFee)}원` : '-'}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>총 쿠폰 사용</div>
                        <div className={styles.value}>{totals.couponUsed ? `${formatWon(totals.couponUsed)}원` : '-'}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>총 포인트 사용</div>
                        <div className={styles.value}>{totals.pointsUsed ? `${formatWon(totals.pointsUsed)}원` : '-'}</div>
                    </div>
                </section>

                {/* 거래 일시 */}
                <section className={styles.meta_group}>
                    <div className={styles.meta_row}>
                        <span className={styles.meta_label}>거래 일시</span>
                        <span className={styles.meta_value}>{fmtDate(info.transactedAt)}</span>
                    </div>
                </section>
            </div>
        </>
    );
}
