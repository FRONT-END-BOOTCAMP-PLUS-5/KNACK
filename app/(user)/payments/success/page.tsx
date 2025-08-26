'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './SuccessPage.module.scss';
import requester from '@/utils/requester';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { Coupon, OrderItem, RepresentativeProduct } from '@/types/order';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { IAddress } from '@/types/address';
import Text from '@/components/common/Text';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/services/cart';
import Flex from '@/components/common/Flex';

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [IAddress, setIAddress] = useState<IAddress | null>(null);
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [repProd, setRepProd] = useState<RepresentativeProduct | null>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [otherOrdersCount, setOtherOrdersCount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>();
  const [pointsToUse, setPointsToUse] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [targetSumAfterCoupon, setTargetSumAfterCoupon] = useState(0);

  // ✅ URL 파라미터를 원시값으로 고정
  const tossPaymentKey = useMemo(() => params.get('paymentKey') ?? '', [params]);
  const tossOrderId = useMemo(() => params.get('orderId') ?? '', [params]);
  const paymentAmount = useMemo(() => {
    const amountParam = params.get('amount');
    const parsedAmount = amountParam === null ? NaN : Number(amountParam);
    return parsedAmount;
  }, [params]);

  // 총액(파라미터), 구매가(subtotal), 수수료 계산
  const totalAmount = useMemo(() => (Number.isFinite(paymentAmount) ? Number(paymentAmount) : 0), [paymentAmount]);
  const subtotal = useMemo(
    () => orderItems.reduce((s, it) => s + Number(it.price ?? 0) * Number(it.quantity ?? 0), 0),
    [orderItems]
  );

  // Helper function to read processed payments
  type ProcessedPayment = { tossPaymentKey: string; tossOrderId: string; at: number };

  const readProcessed = useCallback((): ProcessedPayment[] => {
    try {
      return JSON.parse(sessionStorage.getItem('processedPayments') || '[]');
    } catch {
      return [];
    }
  }, []);

  const writeProcessed = useCallback(
    (entry: ProcessedPayment) => {
      const list = readProcessed();
      // 같은 paymentKey 또는 같은 orderId가 이미 있으면 중복으로 간주
      const dup = list.some((p) => p.tossPaymentKey === entry.tossPaymentKey || p.tossOrderId === entry.tossOrderId);
      if (!dup) {
        list.push(entry);
        sessionStorage.setItem('processedPayments', JSON.stringify(list));
      }
    },
    [readProcessed]
  );

  // 1) sessionStorage에서 복구
  useEffect(() => {
    const stored = sessionStorage.getItem('paymentData');
    const coupon = sessionStorage.getItem('selectedCoupon');
    const orderItems = sessionStorage.getItem('orderItems');
    const address = sessionStorage.getItem('selectedAddress');

    if (stored) {
      const paymentData = JSON.parse(stored);
      setDiscountAmount(paymentData.couponDiscountAmount);
      setShippingFee(paymentData.shippingFee);
      setTargetSumAfterCoupon(paymentData.targetSumAfterCoupon);
      setPointsToUse(paymentData.pointAmount);
    }
    if (coupon) {
      const parsed = JSON.parse(coupon);
      setSelectedCoupon(parsed);
    }
    if (orderItems) {
      const parsed = JSON.parse(orderItems);

      setOrderItems(parsed);
    }
    if (address) {
      const parsed = JSON.parse(address);
      setIAddress(parsed);
    }
  }, []);

  const hasRun = useRef(false);

  // 2) 결제 및 주문 저장
  useEffect(() => {
    if (!user) {
      console.log('SKIP: no user');
      return;
    }
    if (!IAddress?.id) {
      console.log('SKIP: no address');
      return;
    }
    if (orderItems.length === 0) {
      console.log('SKIP: no orderItems');
      return;
    }
    if (!tossPaymentKey || !tossOrderId || Number.isNaN(paymentAmount)) {
      console.log('SKIP: invalid params', { tossPaymentKey, tossOrderId, paymentAmount });
      return;
    }
    if (hasRun.current) {
      console.log('SKIP: hasRun');
      return;
    }

    // 이미 처리된 결제/주문이면 스킵 (여기서 막히면 아래가 안 찍힘)
    const already = readProcessed().some((p) => p.tossPaymentKey === tossPaymentKey || p.tossOrderId === tossOrderId);
    if (already) {
      console.log('SKIP: already processed', { tossPaymentKey, tossOrderId });
      return;
    }

    // 인플라이트 락
    const inflightKey = sessionStorage.getItem('processingOrderId');
    if (inflightKey && inflightKey === tossOrderId) {
      console.log('SKIP: inflight lock');
      return;
    }
    sessionStorage.setItem('processingOrderId', tossOrderId);

    hasRun.current = true;

    // CheckoutPage에서 저장해둔 cartIds 꺼내기
    const raw = sessionStorage.getItem('cartIds');
    const cartIds: number[] = raw ? JSON.parse(raw) : [];


    (async () => {
      try {
        console.log('➡️ 주문 저장 요청 /api/orders', { orderItems, targetSumAfterCoupon, discountAmount, pointsToUse });
        const orderRes = await requester.post('/api/orders', {
          userId: user.id,
          items: orderItems.map((item) => ({
            productId: item.productId,
            price: item.price,
            salePrice: targetSumAfterCoupon,
            count: item.quantity,
            addressId: IAddress.id,
            paymentId: null,
            optionValueId: item?.optionValue?.id,
            couponPrice: discountAmount,
            point: pointsToUse,
          })),
        });

        const createdOrderIds: number[] = orderRes.data.orderIds || [];
        console.log('✅ 주문 저장 완료:', createdOrderIds);

        console.log('➡️ 결제 확인/저장 요청 /api/payments');
        const paymentRes = await requester.post('/api/payments', {
          tossPaymentKey,
          orderId: tossOrderId,
          amount: paymentAmount,
          addressId: IAddress.id,
          orderIds: createdOrderIds,
          selectedCouponId: selectedCoupon?.id ?? null,
          pointsToUse: pointsToUse,
        });

        // ✅ cartIds를 가진 장바구니만 로컬 스토어에서 제거
        cartService.removesCart(cartIds);
        useCartStore.getState().removeStoreCarts(cartIds);

        // ⚓ paymentId + paymentNumber 확보
        const pid: number | null = paymentRes.data?.id ?? null;
        console.log(pid);
        setPaymentId(pid);
        setPaymentNumber(String(paymentRes.data.paymentNumber ?? ''));
        console.log('✅ 결제 저장 완료:', { paymentNumber: paymentRes.data.paymentNumber, id: pid });

        // ✅ 여기서만 '처리됨' 기록
        writeProcessed({ tossPaymentKey, tossOrderId, at: Date.now() });

        // 정리
        sessionStorage.removeItem('cartIds');
        sessionStorage.removeItem('orderItems');
        sessionStorage.removeItem('selectedAddress');
      } catch (err) {
        console.error('❌ 결제/주문 저장 실패', err);
        if (axios.isAxiosError(err)) console.error('📛 서버 응답:', err.response?.data);
        sessionStorage.removeItem('paymentProcessed');
        hasRun.current = false;
        router.replace('/payments/failure');
      } finally {
        // 인플라이트 해제
        sessionStorage.removeItem('processingOrderId');
      }
    })();
  }, [
    IAddress,
    orderItems,
    tossPaymentKey,
    tossOrderId,
    paymentAmount,
    router,
    pointsToUse,
    selectedCoupon?.id,
    targetSumAfterCoupon,
    user,
    discountAmount,
    readProcessed,
    writeProcessed,
  ]);

  // 3) 대표상품 조회 (위에서 저장한 paymentId로 API 호출)
  useEffect(() => {
    if (!paymentId) return;

    (async () => {
      try {
        // 1) 결제 → 첫 주문 ID + ‘외 N건’
        const payRes = await requester.get(`/api/payments/${paymentId}`);
        let orderIds: number[] = payRes.data?.orderIds ?? [];
        if ((!orderIds || orderIds.length === 0) && Array.isArray(payRes.data?.orders)) {
          orderIds = payRes.data.orders.map((o: { id: number }) => o.id).filter((v: number) => Number.isFinite(v));
        }
        setOtherOrdersCount(Math.max(0, (orderIds?.length ?? 0) - 1));

        const firstOrderId = orderIds?.[0];
        if (!Number.isFinite(firstOrderId)) {
          setRepProd(null);
          return;
        }

        // 2) 첫 주문 상세 → 대표상품 + 배송비
        const ordRes = await requester.get(`/api/orders/${firstOrderId}`);
        const order = ordRes.data;
        setRepProd(order.product ?? null);
      } catch (e) {
        console.error('❌ 대표상품/주문 로드 실패', e);
        setRepProd(null);
        setShippingFee(0);
      }
    })();
  }, [paymentId]);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className={styles.sheet}>
      <Flex direction="column" align="center" justify="center">
        <h2 className={styles.title}>구매가 완료되었습니다.</h2>
        <p className={styles.subtitle}>주문 즉시 출고를 준비하여 안전하게 배송 될 예정입니다.</p>

        <div className={styles.image_wrap}>
          {repProd?.thumbnailImage && (
            <Image
              src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${repProd.thumbnailImage}`}
              alt={repProd.korName}
              width={80}
              height={80}
              className={styles.productImage}
            />
          )}
        </div>
      </Flex>

      <button className={styles.primary_btn} onClick={() => router.push(paymentNumber ? `/my/order/${paymentNumber}` : '/my/buying?tab=all')}>
        구매 내역 상세보기
      </button>
      <p className={styles.notice}>구매 후 15분 이내에 구매 여부를 결정할 수 있습니다.</p>

      {/* 결제 요약 */}
      <section className={styles.summary_box}>
        <div className={styles.summary_header}>
          <Text>총 결제금액 </Text>

          <strong>{fmt(totalAmount)}원</strong>
        </div>

        <div className={styles.row}>
          <div>구매가{otherOrdersCount > 0 && <span className={styles.etc}> 외 {otherOrdersCount}건</span>}</div>
          <div>{fmt(subtotal)}원</div>
        </div>

        <div className={styles.row}>
          <div>배송비</div>
          <div>{shippingFee > 0 ? `${fmt(shippingFee)}원` : '무료'}</div>
        </div>

        <div className={styles.row}>
          <div>쿠폰 사용</div>
          <div>{selectedCoupon ? `-${fmt(discountAmount)}원` : '-'}</div>
        </div>

        <div className={styles.row}>
          <div>포인트 사용</div>
          <div>{pointsToUse > 0 ? `-${fmt(pointsToUse)}P` : '-'}</div>
        </div>
      </section>
    </div>
  );
}
