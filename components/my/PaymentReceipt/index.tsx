'use client';
import React from 'react';
import styles from './paymentReceipt.module.scss';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { useRouter } from 'next/navigation';

type Item = {
    id: string;
    orderNumber: string;     // 예: B-SN123376520
    title: string;           // 예: Vans Classic Slip-On Black
    optionText: string;      // 예: 245 / 일반배송
    status?: '대기 중' | '결제 완료' | '취소됨' | string;
    imageUrl: string;
};

type Totals = {
    subtotal: number;        // 총 구매가
    inspectionFee: number;   // 총 검수비
    serviceFee: number;      // 총 수수료
    shippingFee: number;     // 총 배송비
    couponUsed?: number;     // 총 쿠폰 사용 (없으면 표시 "-")
    pointsUsed?: number;     // 총 포인트 사용 (없으면 표시 "-")
    total: number;           // 최초 결제금액(= 최종 결제금액)
};

type Info = {
    paymentNumber: string;   // 예: O-OR34947640
    transactedAt: Date;      // 거래 일시
    cardMasked: string;      // 예: KB국민카드 ••••••••••700*
};

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
        <div className={styles.page}>
            {/* 상단 헤더 */}
            <header className={styles.header}>
                <button className={styles.backBtn} aria-label="뒤로가기" onClick={() => history.back()}>
                    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <h1>결제 내역 상세</h1>
                <div className={styles.headerSpacer} />
            </header>

            {/* 결제번호 */}
            <div className={styles.metaRow}>
                <span className={styles.metaLabel}>결제번호</span>
                <span className={styles.metaValue}>{info.paymentNumber}</span>
            </div>

            {/* 아이템 리스트 */}
            <section className={styles.card}>
                {items.map((item) => (
                    <article key={item.id} className={styles.itemRow}>
                        <Image src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item.imageUrl}`} width={80} height={80} alt="" className={styles.thumb} />
                        <div className={styles.itemBody}>
                            <div className={styles.itemTop}>
                                <span className={styles.orderNumber}>주문번호 {item.id}</span>
                                {item.status && <span className={styles.badge}>{item.status}</span>}
                            </div>
                            <div className={styles.titleLine} onClick={() => router.push(`/my/buying/${item.id}`)}>
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
            <section className={styles.totalCard}>
                <div className={styles.totalLabel}>최초 결제금액</div>
                <div className={styles.totalValue}>{formatWon(totals.total)}원</div>
            </section>

            {/* 금액 상세 */}
            <section className={styles.detailCard}>
                <div className={styles.row}>
                    <div className={styles.label}>총 구매가</div>
                    <div className={styles.valueStrong}>{formatWon(totals.subtotal)}원</div>
                </div>
                <div className={styles.row}>
                    <div className={styles.label}>총 검수비</div>
                    <div className={styles.valueMuted}>{totals.inspectionFee ? `${formatWon(totals.inspectionFee)}원` : '무료'}</div>
                </div>
                <div className={styles.row}>
                    <div className={styles.label}>
                        총 수수료
                        <span className={styles.tip} title="수수료 안내">ⓘ</span>
                    </div>
                    <div className={styles.value}>{totals.serviceFee ? `${formatWon(totals.serviceFee)}원` : '-'}</div>
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
            <section className={styles.metaGroup}>
                <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>거래 일시</span>
                    <span className={styles.metaValue}>{fmtDate(info.transactedAt)}</span>
                </div>
            </section>

            {/* 결제정보 */}
            <section className={styles.metaGroup}>
                <div className={styles.metaTitle}>결제정보</div>
                <div className={styles.metaNotice}>체결 후 결제 정보 변경은 불가하며, 할부 전환은 카드사 문의 바랍니다.</div>
                <div className={styles.metaRow}>
                    <span className={styles.metaValue}>{info.cardMasked}</span>
                </div>
            </section>
        </div>
    );
}
