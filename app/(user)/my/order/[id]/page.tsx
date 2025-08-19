'use client';
import PaymentReceipt from '@/components/my/PaymentReceipt';
import requester from '@/utils/requester';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type ReceiptItem = {
    id: string;
    orderNumber: string;
    title: string;
    optionText: string;
    status?: string;
    imageUrl: string;
};

type PaymentData = {
    orders?: {
        id?: string | number;
        orderId?: string | number;
        orderNumber?: string;
        number?: string;
        title?: string;
        productTitle?: string;
        size?: string;
        option?: string;
        shippingType?: string;
        statusText?: string;
        status?: string;
        thumbnailImage?: string;
        imageUrl?: string;
    }[];
    approvedAt?: string;
    totals?: {
        subtotal?: number;
        inspectionFee?: number;
        serviceFee?: number;
        shippingFee?: number;
        couponUsed?: number;
        pointsUsed?: number;
        total?: number;
    };
    paymentNumber?: string | number;
    cardMasked?: string;
};

export default function OrderPage() {
    const { id } = useParams<{ id: string }>();

    const [items, setItems] = useState<ReceiptItem[]>([]);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const { data } = await requester.get(`/api/payments/${id}`);
                console.log(data.orders);

                // ✅ PaymentReceipt가 기대하는 형태로 매핑
                const mapped: ReceiptItem[] = (data.orders ?? []).map((o: NonNullable<PaymentData['orders']>[0]) => ({
                    id: String(o.id ?? o.orderId),
                    orderNumber: o.orderNumber ?? o.number ?? '',
                    title: o.product?.engName ?? '',
                    optionText: [o.size ?? o.option, o.shippingType ?? '일반배송']
                        .filter(Boolean)
                        .join(' / '),
                    status: o.statusText ?? o.status,
                    imageUrl: o.product?.thumbnailImage ?? o.imageUrl ?? '/placeholder.png',
                }));

                setItems(mapped);
                setPaymentData(data);
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
        <div>
            <PaymentReceipt
                items={items}
                totals={{
                    // 필요하면 서버 응답에 맞춰 계산/매핑하세요. (일단 안전 기본값)
                    subtotal: paymentData?.totals?.subtotal ?? 0,
                    inspectionFee: paymentData?.totals?.inspectionFee ?? 0,
                    serviceFee: paymentData?.totals?.serviceFee ?? 0,
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
