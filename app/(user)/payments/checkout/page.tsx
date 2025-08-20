'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import styles from './CheckoutPage.module.scss';
import AddressBox from '@/components/address/AddressBox';
import requester from '@/utils/requester';
import PaymentFooter from '@/components/Payments/PaymentFooter';
import OrderSummaryCard from '@/components/Payments/Order/OrderSummaryCard';
import PointSection from '@/components/Payments/Points';
import FinalOrderSummary from '@/components/Payments/Order/FinalOrderSummary';
import { AddressDto } from '@/backend/address/applications/dtos/AddressDto';
import { IProduct } from '@/types/product';
import AddressModal from '@/components/address/AddressModal';
import { formatFullAddress } from '@/utils/formatAddressUtils';
import RequestModal from '@/components/address/RequestModal';
import { Coupon, CheckoutRow, OrderItem, BestCoupon } from '@/types/order';
import CouponSelectModal from '@/components/Payments/CouponSelectModal';
import { IAddress } from '@/types/address';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function CheckoutPage() {
  // ----- Local UI States (Zustand 제거) -----
  const [checkout, setCheckout] = useState<CheckoutRow[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'FAST' | 'STOCK'>('FAST');
  const [deliveryFee, setDeliveryFee] = useState<number>(5000);

  // ✅ 포인트/쿠폰 상태
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [points, setPoints] = useState<number>(0); // 사용 포인트
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isReqOpen, setReqOpen] = useState(false);
  const [isOpenCouponModal, setOpenCouponModal] = useState(false);

  // 선택된 쿠폰(표시/계산은 전체 coupons 기준)
  const effectiveCouponId =
    typeof selectedCouponId === 'number' || selectedCouponId === null ? selectedCouponId : Number(selectedCouponId);

  const selectedCoupon = useMemo(() => {
    if (effectiveCouponId == null) return null;
    return (coupons ?? []).find((c) => String(c.id) === String(effectiveCouponId)) ?? null;
  }, [coupons, effectiveCouponId]);

  // 적용 가능 쿠폰 목록 (필요시 표시용)
  const applicableCoupons = useMemo(() => {
    const pset = new Set(orderItems.map((i) => i.productId));
    return (coupons ?? []).filter((c) => pset.has(c.productId));
  }, [coupons, orderItems]);

  // 금액 계산 통합
  const pricing = useMemo(() => {
    // 1) 원가 기준 합계(상품 총액)
    const baseSum = orderItems?.reduce((sum, it) => sum + it.price * it.quantity, 0) || 0;

    // 2) 선택 쿠폰이 실제로 적용 가능한지
    const isCouponApplicable = !!selectedCoupon && orderItems.some((it) => it.productId === selectedCoupon.productId);
    console.log('isCouponApplicable', isCouponApplicable);

    // 3) 해당 상품군 합계(쿠폰 타깃 금액)
    const targetSum = isCouponApplicable
      ? orderItems
        .filter((it) => it.productId === selectedCoupon!.productId)
        .reduce((s, it) => s + it.price * it.quantity, 0)
      : 0;

    // 4) 쿠폰 할인금액 (과할인 방지)
    const couponDiscount = isCouponApplicable
      ? Math.min(targetSum, Math.max(0, Math.floor(targetSum * ((selectedCoupon!.salePercent ?? 0) / 100))))
      : 0;

    // 5) 배송비
    const shippingFee = 0;

    // 6) 쿠폰 적용 후 상품금액
    const productAfterCoupon = Math.max(0, baseSum - couponDiscount);

    const targetSumAfterCoupon = Math.max(0, targetSum - couponDiscount);

    // 7) 최종 결제금액
    const totalPayable = Math.max(0, productAfterCoupon + shippingFee);

    return {
      baseSum, // 원래 상품금액(쿠폰 전)
      couponDiscount,
      targetSumAfterCoupon, // 쿠폰 할인
      productAfterCoupon, // 쿠폰 적용 후 상품금액
      shippingFee, // 배송비
      totalPayable, // 최종 결제금액
      applicableCount: applicableCoupons.length,
      isCouponApplicable,
    };
  }, [orderItems, selectedCoupon, applicableCoupons.length]);

  // ----- totals -----
  const priceWithoutDelivery = useMemo(
    () => orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [orderItems]
  );

  // ✅ 쿠폰 할인액 계산 (선택된 1장의 퍼센트 할인)
  const couponAmount = useMemo(() => {
    if (!selectedCouponId) return 0;
    const coupon = coupons.find((c) => c.id === selectedCouponId);
    if (!coupon) return 0;
    const targetSum = orderItems
      .filter((i) => i.productId === coupon.productId)
      .reduce((s, i) => s + i.price * i.quantity, 0);
    return Math.max(0, Math.floor(targetSum * (coupon.salePercent / 100)));
  }, [selectedCouponId, coupons, orderItems]);

  const totalBeforePoints = useMemo(
    () => Math.max(0, priceWithoutDelivery + deliveryFee - couponAmount),
    [priceWithoutDelivery, deliveryFee, couponAmount]
  );
  const totalPrice = useMemo(() => Math.max(0, totalBeforePoints - points), [totalBeforePoints, points]);

  // ----- save request message -----
  const handleSaveRequestMessage = async () => {
    if (!selectedAddress?.id) {
      alert('주소가 선택되지 않았습니다.');
      return;
    }
    try {
      await requester.patch(`/api/addresses/${selectedAddress.id}/message`, {
        requestMessage: selectedAddress.message,
      });
    } catch (e) {
      console.error('요청사항 저장 실패', e);
      alert('요청사항 저장 중 오류가 발생했습니다.');
    }
  };

  // ----- payment -----
  const handlePayment = async () => {
    if (!orderItems.length) return alert('상품을 선택해주세요.');
    if (!selectedAddress) return alert('주소지를 선택해주세요.');

    try {
      await handleSaveRequestMessage();

      // ✅ 성공 페이지에서 보여주려면 세션에 저장
      const paymentData = {
        pointAmount: points,
        couponDiscountAmount: pricing.couponDiscount,
        shippingFee: pricing.shippingFee,
        targetSumAfterCoupon: pricing.targetSumAfterCoupon,
      };

      // 문자열로 변환해서 저장
      if (selectedCoupon) {
        sessionStorage.setItem('selectedCoupon', JSON.stringify(selectedCoupon));
      } else {
        sessionStorage.removeItem('selectedCoupon'); // 빈 문자열보다 이게 안전
      }
      sessionStorage.setItem('paymentData', JSON.stringify(paymentData));

      const toss = await loadTossPayments(TOSS_CLIENT_KEY);
      console.log(toss);
      await toss.requestPayment('카드', {
        amount: totalPrice,
        orderId: `order_${Date.now()}`, // 권장: 서버에서 선발급한 orderNumber 사용
        orderName: `${orderItems[0]?.kor_name || orderItems[0]?.eng_name || '상품'} ${orderItems.length > 1 ? `외 ${orderItems.length - 1}개` : ''
          } 주문`,
        customerName: selectedAddress.name || '홍길동',
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/failure`,
      });
    } catch (e) {
      console.error(e);
      alert('결제 실패');
    }
  };

  // ----- load checkout from localStorage -----
  useEffect(() => {
    // localStorage는 클라에서만 접근 가능
    const raw = typeof window !== 'undefined' ? localStorage.getItem('checkout') : null;
    if (!raw) return;
    try {
      const parsed: CheckoutRow[] = JSON.parse(raw);
      setCheckout(parsed);
    } catch (e) {
      console.error('checkout 파싱 실패', e);
    }
  }, []);

  // ----- fetch products in batch & build orderItems -----
  useEffect(() => {
    if (!checkout.length) return;
    (async () => {
      try {
        const ids = checkout.map((c) => c.productId);
        const { data } = await requester.post('/api/products', { ids });
        const results = data.results as (IProduct | null)[];

        const items: OrderItem[] = results.flatMap((p, i) =>
          p
            ? [
              {
                productId: p.id,
                price: p.price,
                quantity: checkout[i].quantity,
                thumbnail_image: p.thumbnailImage,
                deliveryType: checkout[i].deliveryMethod,
                kor_name: p.korName,
                eng_name: p.engName,
                optionValue: p?.productOptionMappings[0]?.optionType?.optionValue?.find(
                  (item) => item?.id === checkout[i]?.optionValueId
                ),
              },
            ]
            : []
        );

        setOrderItems(items);
        // 필요 시 성공 페이지용으로 보존
        sessionStorage.setItem('orderItems', JSON.stringify(items));
      } catch (e) {
        console.error('batch fetch failed:', e);
      }
    })();
  }, [checkout]);

  useEffect(() => {
    if (orderItems.length === 0) return;

    (async () => {
      try {
        // 쿠폰 조회
        const { data: couponRes } = await requester.get('/api/coupon');
        const fetched = couponRes?.result ?? couponRes ?? [];

        // 구매한 상품 ID 목록
        const purchasedProductIds = new Set(orderItems.map(item => item.productId));

        // 구매한 상품에 적용 가능한 쿠폰만 필터링
        const validCoupons = fetched.filter((coupon: Coupon) => purchasedProductIds.has(coupon.productId));

        setCoupons(validCoupons);

        // 1) productId별 주문 합계 사전 집계 (최적화)
        const totalsByProductId = orderItems.reduce<Map<number, number>>((map, it) => {
          const sum = (map.get(it.productId) ?? 0) + it.price * it.quantity;
          map.set(it.productId, sum);
          return map;
        }, new Map());

        // 2) reduce로 최댓값 선택
        const initialBest: BestCoupon = { id: null, discount: -1 };

        const best = (fetched as Coupon[]).reduce<BestCoupon>((best: BestCoupon, c) => {
          const target = totalsByProductId.get(c.productId) ?? 0;
          const disc = Math.floor(target * (c.salePercent / 100));
          return disc > best.discount ? { id: c.id, discount: disc } : best;
        }, initialBest);

        setSelectedCouponId(best.id);

        // 포인트 조회
        const { data: pData } = await requester.get('/api/points');
        setAvailablePoints(Number(pData?.availablePoints ?? 0));
      } catch (e) {
        console.error('쿠폰/포인트 로드 실패', e);
      }
    })();
  }, [orderItems]);

  // ✅ 포인트 사용량 캡 (서버 값/합계 변경될 때 보정)
  useEffect(() => {
    const cap = Math.min(totalBeforePoints, availablePoints);
    if (points > cap) setPoints(cap);
  }, [totalBeforePoints, availablePoints, points]);

  // ----- fetch default address -----
  useEffect(() => {
    (async () => {
      try {
        const res = await requester.get('/api/addresses');
        const addresses: AddressDto[] = res.data;
        const def = addresses.find((a) => a.isDefault);
        if (def) {
          const addr = {
            id: def.id,
            name: def.name,
            phone: def.phone ?? '',
            detail: def.detail ?? '',
            message: def.message ?? '',
            isDefault: def.isDefault ?? false,
            address: {
              zipCode: def.address.zipCode,
              main: def.address.main,
            },
          };
          setSelectedAddress(addr);
          sessionStorage.setItem('selectedAddress', JSON.stringify(addr));
        }
      } catch (err) {
        console.error('주소 불러오기 실패', err);
      }
    })();
  }, []);

  return (
    <main className={styles.checkout_container}>
      <AddressBox
        selectedAddress={selectedAddress ?? null}
        onOpenModal={() => setIsAddressModalOpen(true)}
        onOpenRequestModal={() => setReqOpen(true)}
        onChangeRequest={(req) => {
          if (!selectedAddress) return;
          setSelectedAddress({ ...selectedAddress, message: req }); // zustand 업데이트
        }}
      />

      {/* 주문 요약 카드: 여러 상품 렌더링하는 버전 사용 */}
      <OrderSummaryCard
        orderItems={orderItems}
        deliveryType={deliveryType}
        onChangeDelivery={(t) => {
          setDeliveryType(t);
          setDeliveryFee(t === 'FAST' ? 5000 : 0);
        }}
        // 💰 금액(전부 부모 계산)
        baseSum={pricing.baseSum}
        shippingFee={pricing.shippingFee}
        couponDiscount={pricing.couponDiscount}
        totalPayable={pricing.totalPayable}
        // 🎟 쿠폰 표시/행동
        selectedCouponName={selectedCoupon?.name ?? null}
        applicableCouponCount={pricing.applicableCount}
        onOpenCouponModal={() => setOpenCouponModal(true)} // 모달은 부모에서 관리
        onClearCoupon={() => setSelectedCouponId(null)} // 선택 해제
      />

      {isOpenCouponModal && (
        <CouponSelectModal
          isOpen={isOpenCouponModal}
          onClose={() => setOpenCouponModal(false)}
          coupons={coupons} // 서버에서 받은 쿠폰 목록
          orderItems={orderItems} // 장바구니 아이템
          selectedCouponId={selectedCouponId}
          onSelectCoupon={(id) => {
            setSelectedCouponId(id); // 선택 반영
            setOpenCouponModal(false); // 선택 후 모달 닫기(선호)
          }}
        />
      )}

      <PointSection
        availablePoints={availablePoints}
        maxUsablePoints={totalBeforePoints} // 🔥 추가
        onChange={(p) => setPoints(Math.max(0, Math.min(p, totalBeforePoints)))} // 🔥 캡 적용
      />

      <FinalOrderSummary
        price={pricing.baseSum} // 쿠폰 전 상품 총액
        fee={0} // 수수료 있으면 숫자
        shippingFee={pricing.shippingFee} // 배송비
        couponAmount={pricing.couponDiscount} // 쿠폰 할인액
        pointAmount={points} // 사용 포인트
        selectedCouponName={selectedCoupon?.name} // 쿠폰 이름 표시
      />

      <PaymentFooter totalPrice={totalPrice} onPay={handlePayment} />

      {isAddressModalOpen && (
        <AddressModal
          onClose={() => setIsAddressModalOpen(false)}
          selectedAddress={
            selectedAddress
              ? {
                ...selectedAddress,
                message: selectedAddress.message,
              }
              : null
          }
          onChangeSelected={(a: IAddress) => {
            const zip =
              a.address.zipCode ?? '';

            if (!a?.id) return; // Early return if no valid address

            const mapped = {
              id: a.id,
              name: a.name ?? '',
              phone: a.phone ?? '',
              address: {
                zipCode: zip,
                main: a.address.main,
              },
              detail: a.detail ?? '',
              message: a.message ?? '',
              isDefault: a.isDefault ?? false,
            };
            setSelectedAddress(mapped);
            sessionStorage.setItem('selectedAddress', JSON.stringify(mapped));
          }}
        />
      )}

      <RequestModal
        open={isReqOpen}
        value={selectedAddress?.message ?? ''}
        onClose={() => setReqOpen(false)}
        onApply={(next) => {
          if (!selectedAddress) return;
          const updated = { ...selectedAddress, request: next };
          setSelectedAddress(updated);
          sessionStorage.setItem('selectedAddress', JSON.stringify(updated));
        }}
      />
    </main>
  );
}
