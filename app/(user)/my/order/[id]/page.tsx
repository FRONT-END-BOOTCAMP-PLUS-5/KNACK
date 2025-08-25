'use client';
import PaymentReceipt from '@/components/my/PaymentReceipt';
import requester from '@/utils/requester';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './orderPage.module.scss';
import { computeTotalsFromOrders } from '@/utils/orders';
import { PaymentData, ReceiptItem } from '@/types/payment';
import { OrderResponse } from '@/types/order';

export default function OrderPage() {
    const { id } = useParams<{ id: string }>();

    const [items, setItems] = useState<ReceiptItem[]>([]);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const { data } = await requester.get(`/api/payments/${id}`);

                // ✅ 영수증 카드용 아이템 매핑
                const mapped: ReceiptItem[] = (data.orders ?? []).map((o: OrderResponse) => ({
                    id: String(o.id ?? o.orderId),
                    orderNumber: o.orderNumber ?? o.number ?? '',
                    title:
                        o.product?.engName ??
                        o.productTitle ??
                        o.title ??
                        '',
                    optionText:
                        [
                            o.size ?? o.option ?? o.variant,
                            o.shippingType ?? o.deliveryType ?? '일반배송',
                        ]
                            .filter(Boolean)
                            .join(' / '),
                    status: o.statusText ?? o.status,
                    imageUrl:
                        o.product?.thumbnailImage ??
                        o.thumbnailImage ??
                        o.imageUrl ??
                        '/placeholder.png',
                }));

                // ✅ totals 재계산
                const totals = computeTotalsFromOrders(data.orders);

                // ✅ 결제정보 병합 (서버값이 있으면 유지하고, totals는 재계산값으로 덮어씀)
                const merged: PaymentData = {
                    ...data,
                    totals,
                    paymentNumber: data.paymentNumber ?? data.number ?? data.id,
                    cardMasked:
                        data.cardMasked ??
                        data.card?.numberMasked ??
                        data.cardInfo?.masked ??
                        'KB국민카드 ••••••••••700*',
                };

                setItems(mapped);
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
            <PaymentReceipt
                items={items}
                totals={{
                    subtotal: paymentData?.totals?.subtotal ?? 0,
                    shippingFee: paymentData?.totals?.shippingFee ?? 0,
                    couponUsed: paymentData?.totals?.couponUsed ?? 0,
                    pointsUsed: paymentData?.totals?.pointsUsed ?? 0,
                    total: paymentData?.totals?.total ?? 0,
                }}
                info={{
                    paymentNumber: paymentData?.paymentNumber?.toString() ?? '',
                    transactedAt,
                    cardMasked: paymentData?.cardMasked ?? 'KB국민카드 ••••••••••700*',
                }}
            />
        </div>
    );
}
