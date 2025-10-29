'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './successPage.module.scss';
import requester from '@/utils/requester';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { CheckoutRow, Coupon, OrderItem } from '@/types/order';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import Text from '@/components/common/Text';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/services/cart';
import Flex from '@/components/common/Flex';
import { IPaymentRef, IPaymentSessionData } from '@/types/payment';
import { couponService } from '@/services/coupon';
import { myService } from '@/services/my';
import { IUpdateUserRef } from '@/types/user';

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { fetchUserData } = useUserStore();

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [otherOrdersCount, setOtherOrdersCount] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [targetSumAfterCoupon, setTargetSumAfterCoupon] = useState(0);
  const [paymentSessionData, setPaymentSessionData] = useState<IPaymentSessionData>();

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

    if (stored) {
      const paymentData = JSON.parse(stored);
      setDiscountAmount(paymentData.couponDiscountAmount);
      setShippingFee(paymentData.shippingFee);
      setTargetSumAfterCoupon(paymentData.targetSumAfterCoupon);
      setPaymentSessionData(paymentData);
    }
    if (coupon) {
      const parsed = JSON.parse(coupon);
      setSelectedCoupon(parsed);
    }
    if (orderItems) {
      const parsed = JSON.parse(orderItems);

      setOrderItems(parsed);
    }
  }, []);

  const hasRun = useRef(false);

  // 2) 결제 및 주문 저장
  useEffect(() => {
    if (!user) {
      console.log('SKIP: no user');
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
    const raw = localStorage.getItem('cartIds');
    const rawParse = raw ? JSON.parse(raw) : [];
    const cartIds: number[] = rawParse?.map((item: CheckoutRow) => item?.cartId);

    (async () => {
      try {
        const data: IPaymentRef = {
          tossPaymentKey,
          amount: paymentAmount,
          salePrice: 0,
          detailAddress: paymentSessionData?.detailAddress ?? '',
          mainAddress: paymentSessionData?.mainAddress ?? '',
          name: paymentSessionData?.name ?? '',
          zipCode: paymentSessionData?.zipCode ?? '',
          pointAmount: paymentSessionData?.pointAmount ?? 0,
          orderId: tossOrderId ?? '',
          phone: paymentSessionData?.phone ?? '',
          message: paymentSessionData?.message ?? '',
        };

        // 주문 영수증 생성
        const paymentRes = await requester.post('/api/payments', data);

        // 상품마다의 주문 생성
        await requester.post('/api/orders', {
          userId: user.id,
          items: orderItems.map((item) => ({
            productId: item.productId,
            price: item.price,
            salePrice: targetSumAfterCoupon,
            count: item.quantity,
            paymentId: paymentRes?.data?.result,
            optionValue: item?.optionValue,
            couponPrice: discountAmount,
            point: paymentSessionData?.pointAmount,
            brandName: item?.brandName,
            categoryName: item?.categoryName,
            colorEngName: item?.colorEngName,
            colorKorName: item?.colorKorName,
            engName: item?.engName,
            korName: item?.korName,
            gender: item?.gender,
            optionName: item?.optionName,
            releaseDate: item?.releaseDate,
            subCategoryName: item?.subCategoryName,
            thumbnailImage: item?.thumbnailImage,
          })),
        });

        // ✅ cartIds를 가진 장바구니만 로컬 스토어에서 제거
        cartService.removesCart(cartIds);
        useCartStore.getState().removeStoreCarts(cartIds);

        if (selectedCoupon?.id) {
          await couponService.deleteCoupon(selectedCoupon?.id ?? 0);
        }

        if (user?.point) {
          const calculPoint = user?.point - (paymentSessionData?.pointAmount ?? 0);

          const userUpdatePoint: IUpdateUserRef = {
            point: calculPoint,
          };

          await myService.updateUser(userUpdatePoint);

          fetchUserData();
        }

        // ⚓ paymentId + paymentNumber 확보
        const pid: number | null = paymentRes.data?.id ?? null;
        console.log(pid);
        setPaymentId(pid);
        setPaymentNumber(String(paymentRes.data.paymentNumber ?? ''));

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
    discountAmount,
    fetchUserData,
    orderItems,
    paymentAmount,
    paymentSessionData?.detailAddress,
    paymentSessionData?.mainAddress,
    paymentSessionData?.message,
    paymentSessionData?.name,
    paymentSessionData?.phone,
    paymentSessionData?.pointAmount,
    paymentSessionData?.zipCode,
    readProcessed,
    router,
    selectedCoupon?.id,
    targetSumAfterCoupon,
    tossOrderId,
    tossPaymentKey,
    user,
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
      } catch (e) {
        console.error('❌ 대표상품/주문 로드 실패', e);

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
          {orderItems?.[0]?.thumbnailImage && (
            <Image
              src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${orderItems?.[0]?.thumbnailImage}`}
              alt={orderItems?.[0]?.korName ?? ''}
              width={120}
              height={120}
              className={styles.productImage}
            />
          )}
        </div>
      </Flex>

      <button
        className={styles.primary_btn}
        onClick={() => router.push(paymentNumber ? `/my/order/${paymentNumber}` : '/my/buying?tab=all')}
      >
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
          <div>
            {paymentSessionData?.pointAmount && paymentSessionData?.pointAmount > 0
              ? `-${fmt(paymentSessionData?.pointAmount)}P`
              : '-'}{' '}
          </div>
        </div>
      </section>
    </div>
  );
}
