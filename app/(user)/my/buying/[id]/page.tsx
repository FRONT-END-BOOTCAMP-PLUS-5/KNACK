'use client';

// app/order/[orderId]/page.tsx
import Image from "next/image";
import styles from "./buying.module.scss";
import BuyingFooter from "@/components/my/BuyingFooter";
import { BuyingHeader } from "@/components/my/BuyingHeader";
import { OrderPageProps, RepoAddress, RepoOrderItem } from "@/types/order";
import requester from "@/utils/requester";
import { useState, useEffect, useMemo } from "react";
import { STORAGE_PATHS } from "@/constraint/auth";
import { useRouter } from "next/navigation";

const STEPS = ["구매 확정", "배송 대기", "배송 중", "배송 완료"] as const;
type Step = typeof STEPS[number];

function ProgressBar({ current }: { current: Step }) {
    const currentIdx = STEPS.indexOf(current);
    return (
        <div className={styles.progress}>
            {STEPS.map((label, i) => (
                <div key={label} className={styles.progress_step}>
                    <div className={[styles.dot, i <= currentIdx ? styles.active : ""].join(" ")} />
                    <div className={styles.step_label}>{label}</div>
                    {i < STEPS.length - 1 && (
                        <div className={[styles.bar, i < currentIdx ? styles.active : ""].join(" ")} />
                    )}
                </div>
            ))}
        </div>
    );
}

function formatPrice(n?: number) {
    return (n ?? 0).toLocaleString() + "원";
}

function statusToStep(status?: string): Step {
    const s = (status ?? "").toUpperCase();
    if (s === "PAID") return "구매 확정";
    if (s === "CONFIRMED") return "배송 대기";
    if (s === "DELIVERING") return "배송 중";
    if (s === "COMPLETED") return "배송 완료";
    return "구매 확정";
}

export default function OrderPage({ params }: OrderPageProps) {

    const paymentDataStr = sessionStorage.getItem('paymentData');
    const paymentData = paymentDataStr ? JSON.parse(paymentDataStr) : null;

    const router = useRouter();
    const [item, setItem] = useState<RepoOrderItem[]>([]);
    const [address, setAddress] = useState<RepoAddress | null>(null);
    const [meta, setMeta] = useState<{
        paymentNumber?: string;
        status?: string;
        method?: string;
        createdAt?: string;
    }>({});

    useEffect(() => {
        (async () => {
            try {
                const res = await requester.get(`/api/orders/${params.id}`);
                console.log(res.data);
                const data = res.data ?? {};
                setItem(data ?? null);
                setAddress(data.payment.address ?? null);
                setMeta({
                    paymentNumber: String(data.paymentId ?? ""),
                    status: data.status,
                    method: data.method,
                    createdAt: data.createdAt,
                });
            } catch (e) {
                console.error("Failed to fetch payment data:", e);
            }
        })();
    }, [params.id]);

    // 합계 계산
    const productTotal = 0;
    const total = productTotal + paymentData?.shippingFee - paymentData?.couponDiscountAmount - paymentData?.pointAmount;

    const step: Step = statusToStep(meta.status);

    // 주소 안전 매핑
    const name =
        (address?.name ?? "") || "-";
    const phone =
        (address?.phone ?? "") || "-";
    const zip =
        (address?.zipCode ?? "") || "";
    const main =
        (address?.main ?? "") || "";
    const detail =
        (address?.detail ?? "") || "";
    const message =
        (address?.message ?? "") || "";

    const thumb =
        (item.product)?.thumbnailImage ??
        "/placeholder.png";
    const korname = (item.product)?.korName ?? "";
    const engname = (item.product)?.engName ?? "";
    const variant = (item.optionValue)?.name ?? (item.optionValue)?.value ?? "";

    return (
        <>
            <BuyingHeader /> {/* 타이틀 컴포넌트가 '구매 진행 중'을 보여주도록 되어있다면 OK */}

            <main className={styles.page}>
                {/* 주문번호 */}
                <section className={styles.section}>
                    <div className={styles.order_no}>주문번호 {meta.paymentNumber || "-"}</div>
                </section>

                {/* 상품 카드 */}
                <section key={item.id} className={`${styles.section} ${styles.product_card}`}>
                    <div className={styles.thumb_wrap}>
                        <Image
                            src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${thumb}`}
                            alt={korname}
                            width={80}
                            height={80}
                            className={styles.thumb} />
                    </div>
                    <div className={styles.prod_info}>
                        <div className={styles.k_title}>{korname}</div>
                        <div className={styles.sub_title}>{engname}</div>
                        {variant && <div className={styles.variant}>{variant}</div>}
                    </div>
                </section><button className={styles.detail_btn} onClick={() => router.push(`/products/${item.product?.id}`)}>상품 상세</button>

                {/* 진행 상황 */}
                <section className={styles.section_pink}>
                    <div className={styles.block_title}>진행 상황</div>
                    <ProgressBar current={step} />
                </section>

                {/* 도착 예정 (원하면 서버 값으로 바꿔 연결) */}
                <section className={styles.section}>
                    <div className={styles.eta_card}>
                        <div className={styles.eta_title}>8/19 ~ 8/20 도착 예정</div>
                        <div className={styles.eta_sub}>
                            거래 데이터를 통해 예측한 일정이며, 상황에 따라 변경될 수 있습니다.
                        </div>
                    </div>
                </section>

                {/* 결제 내역 */}
                <section className={styles.section}>
                    <div className={styles.block_title}>결제 내역</div>

                    <div className={styles.list_row}>
                        <div className={styles.label}>구매가</div>
                        <div className={styles.value_emph}>{formatPrice(productTotal)}</div>
                    </div>

                    <div className={styles.list_row}>
                        <div className={styles.label}>배송비</div>
                        <div className={styles.value}>{formatPrice(paymentData?.shippingFee)}</div>
                    </div>

                    <div className={styles.list_row}>
                        <div className={styles.label}>쿠폰 적용가</div>
                        <div className={styles.value}>{formatPrice(paymentData.couponDiscountAmount)}</div>
                    </div>

                    <div className={styles.list_row}>
                        <div className={styles.label}>포인트 사용</div>
                        <div className={styles.value}>{formatPrice(paymentData.pointAmount)}</div>
                    </div>

                    <div className={`${styles.list_row} ${styles.total_row}`}>
                        <div className={styles.label}>총 결제 예정</div>
                        <div className={styles.value_strong}>{formatPrice(total)}</div>
                    </div>

                    <button className={styles.subtle_btn}>결제 내역 상세보기</button>
                </section>

                {/* 배송 주소 */}
                <section className={styles.section}>
                    <div className={styles.block_title_row}>
                        <div className={styles.block_title}>배송 주소</div>
                        <button className={styles.link_btn}>배송지 변경</button>
                    </div>

                    <div className={styles.addr_card}>
                        <div className={styles.addr_row}>
                            <div className={styles.addr_label}>받는 사람</div>
                            <div className={styles.addr_value}>{name}</div>
                        </div>
                        <div className={styles.addr_row}>
                            <div className={styles.addr_label}>휴대폰 번호</div>
                            <div className={styles.addr_value}>{phone}</div>
                        </div>
                        <div className={styles.addr_row}>
                            <div className={styles.addrLabel}>주소</div>
                            <div className={styles.addrValue}>
                                {zip ? `(${zip}) ` : ""}
                                {main} {detail}
                            </div>
                        </div>
                    </div>

                    <div className={styles.block_title_row_2}>
                        <div className={styles.block_title}>배송 요청사항</div>
                        <button className={styles.link_btn}>요청사항 변경</button>
                    </div>

                    <div className={styles.addr_card}>
                        <div className={styles.addr_row}>
                            <div className={styles.addr_label}>요청 사항</div>
                            <div className={styles.addr_value}>{message || "-"}</div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 하단 CTA(디자인에 따라 BuyingFooter가 fixed 버튼을 포함할 수도 있음) */}
            <BuyingFooter />
        </>
    );
}
