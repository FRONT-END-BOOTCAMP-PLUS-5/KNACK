'use client';

// app/order/[orderId]/page.tsx
import Image from "next/image";
import styles from "./buying.module.scss";
import BuyingFooter from "@/components/my/BuyingFooter";
import { BuyingHeader } from "@/components/my/BuyingHeader";
import { OrderPageProps } from "@/types/order";

const STEPS = ["검수합격", "대기 중", "배송"] as const;
type Step = typeof STEPS[number];

function ProgressBar({ current }: { current: Step }) {
    const currentIdx = STEPS.indexOf(current);
    return (
        <div className={styles.progress}>
            {STEPS.map((label, i) => (
                <div key={label} className={styles.progressStep}>
                    <div
                        className={[
                            styles.dot,
                            i <= currentIdx ? styles.active : "",
                        ].join(" ")}
                    />
                    <div className={styles.stepLabel}>{label}</div>
                    {i < STEPS.length - 1 && (
                        <div
                            className={[
                                styles.bar,
                                i < currentIdx ? styles.active : "",
                            ].join(" ")}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function OrderPage({ params }: OrderPageProps) {
    // TODO: 여기에 실제 API 연동
    const mock = {
        orderNo: "B-L123280757",
        title:
            "Chanel Chance Eau Tendre Eau De Parfum 50ml (국내 정식 발매)",
        variant: "50ml / 빠른배송",
        productThumb:
            "", // 샘플
        price: 169000,
        fee: 5500,
        shipping: 5000,
        step: "대기 중" as Step,
        eta: "8/19 ~ 8/20 도착 예정",
        receiver: "윤다영",
        phone: "010-9552-5150",
        address:
            "(01687) 서울 노원구 동일로221길 22 (상계동, 대림아파트) 2동 503호",
        request: "문 앞에 놓아주세요",
    };

    const total = mock.price + mock.fee + mock.shipping;

    return (
        <>
            <BuyingHeader />
            <main className={styles.page}>
                {/* Header */}

                {/* 주문번호 */}
                <section className={styles.section}>
                    <div className={styles.orderNo}>주문번호 {mock.orderNo}</div>
                </section>

                {/* 상품 카드 */}
                <section className={`${styles.section} ${styles.productCard}`}>
                    <div className={styles.thumbWrap}>
                        <Image
                            src={mock.productThumb}
                            alt=""
                            fill
                            sizes="96px"
                            className={styles.thumb}
                        />
                    </div>
                    <div className={styles.prodInfo}>
                        <div className={styles.title}>{mock.title}</div>
                        <div className={styles.variant}>{mock.variant}</div>
                        <button className={styles.linkBtn}>상품 상세</button>
                    </div>
                </section>

                {/* 진행 상태 */}
                <section className={styles.section}>
                    <div className={styles.blockTitle}>진행 상황</div>
                    <ProgressBar current={mock.step} />
                    <div className={styles.stepDesc}>구매 결정대기</div>
                </section>

                {/* ETA */}
                <section className={styles.section}>
                    <div className={styles.etaCard}>
                        <div className={styles.etaTitle}>{mock.eta}</div>
                        <div className={styles.etaSub}>
                            거래 데이터를 통해 예측한 일정이며, 상황에 따라 변경될 수 있습니다.
                        </div>
                    </div>
                </section>

                {/* 결제 내역 */}
                <section className={styles.section}>
                    <div className={styles.blockTitle}>결제 내역</div>

                    <div className={styles.listRow}>
                        <div className={styles.label}>구매가</div>
                        <div className={styles.valueEmph}>
                            {mock.price.toLocaleString()}원
                        </div>
                    </div>

                    <div className={styles.listRow}>
                        <div className={styles.label}>검수비</div>
                        <div className={styles.valueMuted}>무료</div>
                    </div>

                    <div className={styles.listRow}>
                        <div className={styles.label}>
                            수수료 <span className={styles.tip} aria-label="수수료 안내">?</span>
                        </div>
                        <div className={styles.value}>
                            {mock.fee > 0 ? `${mock.fee.toLocaleString()}원` : "-"}
                        </div>
                    </div>

                    <div className={styles.listRow}>
                        <div className={styles.label}>배송비</div>
                        <div className={styles.value}>
                            {mock.shipping.toLocaleString()}원
                        </div>
                    </div>

                    <div className={`${styles.listRow} ${styles.totalRow}`}>
                        <div className={styles.label}>총 결제 예정</div>
                        <div className={styles.valueStrong}>
                            {total.toLocaleString()}원
                        </div>
                    </div>

                    <button className={styles.subtleBtn}>결제 내역 상세보기</button>
                </section>

                {/* 배송 주소 */}
                <section className={styles.section}>
                    <div className={styles.blockTitleRow}>
                        <div className={styles.blockTitle}>배송 주소</div>
                        <button className={styles.linkBtn}>배송지 변경</button>
                    </div>

                    <div className={styles.addrCard}>
                        <div className={styles.addrRow}>
                            <div className={styles.addrLabel}>받는 사람</div>
                            <div className={styles.addrValue}>{mock.receiver}</div>
                        </div>
                        <div className={styles.addrRow}>
                            <div className={styles.addrLabel}>휴대폰 번호</div>
                            <div className={styles.addrValue}>{mock.phone}</div>
                        </div>
                        <div className={styles.addrRow}>
                            <div className={styles.addrLabel}>주소</div>
                            <div className={styles.addrValue}>{mock.address}</div>
                        </div>
                    </div>

                    <div className={styles.blockTitleRow}>
                        <div className={styles.blockTitle}>배송 요청사항</div>
                        <button className={styles.linkBtn}>요청사항 변경</button>
                    </div>

                    <div className={styles.addrCard}>
                        <div className={styles.addrRow}>
                            <div className={styles.addrLabel}>요청 사항</div>
                            <div className={styles.addrValue}>{mock.request}</div>
                        </div>
                    </div>
                </section>
            </main>
            <BuyingFooter />
        </>
    );
}
