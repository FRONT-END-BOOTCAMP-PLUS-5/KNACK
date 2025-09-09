'use client';

import Image from 'next/image';
import styles from './buying.module.scss';
import BuyingFooter from '@/components/my/BuyingFooter';
import { BuyingHeader } from '@/components/my/BuyingHeader';
import { BuyingPageProps, RepoOrderItem, Step } from '@/types/order';
import requester from '@/utils/requester';
import { useState, useEffect, useMemo } from 'react';
import { STORAGE_PATHS } from '@/constraint/auth';
import { useRouter } from 'next/navigation';
import RequestModal from '@/components/address/RequestModal';
import AddressModal from '@/components/address/AddressModal';
import { formatPhoneNumber } from '@/utils/formatAddressUtils';
import { IAddress } from '@/types/address';
import { formatPrice, ProgressBar, statusToStep } from '@/utils/orders';
import Text from '@/components/common/Text';

export default function BuyingPage({ params }: BuyingPageProps) {
  const router = useRouter();
  const paymentDataStr = sessionStorage.getItem('paymentData');
  const paymentData = paymentDataStr ? JSON.parse(paymentDataStr) : null;

  const [orderId, setOrderId] = useState<string>('');
  const [item, setItem] = useState<RepoOrderItem | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isReqOpen, setReqOpen] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(true);
  const [confirming, setConfirming] = useState(false);

  // 하단 버튼 클릭시 완료 처리
  const handleFooterClick = async () => {
    setConfirming(true);
    try {
      setIsPaymentCompleted(true);
      await requester.put(`/api/orders/${orderId}`, { status: 2 });
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      setIsPaymentCompleted(false);
    } finally {
      setConfirming(false);
    }
  };

  // 합계 계산
  const productTotal = useMemo(() => {
    if (!item) return 0;
    const price = Number(item.price ?? 0);
    const quantity = item.count ?? 1;
    return price * quantity;
  }, [item]);

  const total = productTotal + (paymentData?.shippingFee ?? 0) - (item?.couponPrice ?? 0) - (item?.point ?? 0);

  const step: Step = statusToStep(item?.deliveryStatus);

  useEffect(() => {
    params.then(({ id }) => {
      setOrderId(id);
    });
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    (async () => {
      try {
        const res = await requester.get(`/api/orders/${orderId}`);
        const data = res.data ?? {};
        console.log(data, isPaymentCompleted);

        setItem(data ?? null);
        setAddress(
          data.payment?.address
            ? {
                ...data.payment.address,
                address: {
                  zipCode: data.payment.address.zipCode,
                  main: data.payment.address.main,
                },
              }
            : null
        );

        const paymentStatus = data.deliveryStatus as number | undefined;

        // status가 CONFIRMED이면 결제 완료 처리
        if (paymentStatus === 2) {
          setIsPaymentCompleted(true);
        }
        // 결제 완료 시간 체크 로직
        else if (data.payment?.approvedAt) {
          const approvedTime = new Date(data.payment.approvedAt).getTime();
          const currentTime = new Date().getTime();
          const timeDiff = currentTime - approvedTime;

          // 15분(900000ms) 이상 지났으면 완료 처리
          if (timeDiff >= 900000) {
            setIsPaymentCompleted(true);
            requester.put(`/api/orders/${orderId}`, { status: 2 });
          } else {
            // 남은 시간만큼 타이머 설정
            setIsPaymentCompleted(false);
            const remainingTime = 900000 - timeDiff;
            setTimeout(() => {
              setIsPaymentCompleted(true);
              requester.put(`/api/orders/${orderId}`, { status: 2 });
            }, remainingTime);
          }
        }
      } catch (e) {
        console.error('Failed to fetch payment data:', e);
      }
    })();
  }, [isPaymentCompleted, orderId]);

  return (
    <>
      <BuyingHeader /> {/* 타이틀 컴포넌트가 '구매 진행 중'을 보여주도록 되어있다면 OK */}
      {/* 주문번호 */}
      <section className={styles.section}>
        <Text size={1.2} weight={600}>
          주문번호 {item?.payment?.paymentNumber || '-'}
        </Text>
      </section>
      {/* 상품 카드 */}
      <section key={item?.id} className={`${styles.section} ${styles.product_card}`}>
        <div className={styles.thumb_wrap}>
          <Image
            src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${item?.thumbnailImage}`}
            alt={item?.korName ?? ''}
            width={80}
            height={80}
            className={styles.thumb}
          />
        </div>
        <div className={styles.prod_info}>
          <Text size={1.4} weight={500} marginBottom={2}>
            {item?.engName}
          </Text>
          <Text size={1.3} color="gray2">
            {item?.korName}
          </Text>
          <Text size={1.4} weight={600} marginTop={10}>
            {item?.optionValue}
          </Text>
        </div>
      </section>
      <section className={styles.section} style={{ borderTop: 'none' }}>
        <button className={styles.detail_btn} onClick={() => router.push(`/products/${item?.productId}`)}>
          상품 상세
        </button>
      </section>
      {/* 진행 상황 */}
      <section className={styles.section_pink}>
        <Text size={1.6} weight={700} lineHeight="24px" marginBottom={12}>
          진행 상황
        </Text>
        <ProgressBar current={step} />
      </section>
      {/* 결제 내역 */}
      <section className={styles.section}>
        <Text size={1.6} weight={700} className={styles.payment_title} paddingBottom={12}>
          결제 내역
        </Text>
        <div className={styles.list_row}>
          <Text size={1.4}>구매가</Text>
          <Text size={1.4} weight={700}>
            {formatPrice(productTotal)}
          </Text>
        </div>

        <div className={styles.list_row}>
          <Text size={1.4}>배송비</Text>
          <Text size={1.4}>{0}원</Text>
        </div>

        <div className={styles.list_row}>
          <Text size={1.4}>쿠폰 적용가</Text>
          <Text size={1.4}>{formatPrice(item?.couponPrice)}</Text>
        </div>

        <div className={`${styles.list_row} ${styles.total_row}`}>
          <Text size={1.4}>결제 예정 금액</Text>
          <div className={styles.value_strong}>{formatPrice(total)}</div>
        </div>

        <button className={styles.subtle_btn} onClick={() => router.push(`/my/order/${item?.payment?.paymentNumber}`)}>
          결제 내역 상세보기
        </button>
      </section>
      {/* 배송 주소 */}
      <section className={styles.section}>
        <Text size={1.6} weight={700}>
          배송 주소
        </Text>

        <div className={styles.addr_card}>
          <div className={styles.addr_row}>
            <Text>받는 사람</Text>
            <Text>{item?.payment?.name}</Text>
          </div>
          <div className={styles.addr_row}>
            <Text>휴대폰 번호</Text>
            <Text>{formatPhoneNumber(item?.payment?.phone ?? '')}</Text>
          </div>
          <div className={styles.addr_row}>
            <Text>주소</Text>
            <Text>
              {item?.payment?.zipCode ? `(${item?.payment?.zipCode}) ` : ''}
              {item?.payment?.mainAddress} {item?.payment?.detailAddress}
            </Text>
          </div>
        </div>

        <div className={styles.block_title_row_2}>
          <Text size={1.6} weight={700}>
            배송 요청사항
          </Text>
          <button className={styles.link_btn} onClick={() => setReqOpen(true)}>
            요청사항 변경
          </button>
        </div>

        <div className={styles.addr_card}>
          <div className={styles.addr_row}>
            <Text>요청 사항</Text>
            <Text>{item?.payment?.deliveryMessage || '-'}</Text>
          </div>
        </div>
      </section>
      {isAddressModalOpen && (
        <AddressModal
          onClose={() => setIsAddressModalOpen(false)}
          selectedAddress={
            address
              ? {
                  id: address.id,
                  name: address.name,
                  phone: address.phone,
                  address: {
                    zipCode: address.address?.zipCode ?? '',
                    main: address.address?.main ?? '',
                  },
                  detail: address.detail ?? '',
                  message: address.message ?? '',
                  isDefault: address.isDefault ?? false,
                }
              : null
          }
          onChangeSelected={(a: IAddress) => {
            if (!a?.id) return;
            const mapped = {
              id: a.id,
              name: a.name ?? '',
              phone: a.phone ?? '',
              address: {
                zipCode: a.address.zipCode,
                main: a.address.main,
              },
              detail: a.detail ?? '',
              message: a.message ?? '',
              isDefault: a.isDefault ?? false,
            };
            setAddress(mapped);
            sessionStorage.setItem('IAddress', JSON.stringify(mapped));
          }}
        />
      )}
      <RequestModal
        open={isReqOpen}
        value={address?.message ?? ''}
        onClose={() => setReqOpen(false)}
        onApply={(next) => {
          if (!address) return;
          const updated = { ...address, message: next };
          setAddress(updated);
          sessionStorage.setItem('IAddress', JSON.stringify(updated));
        }}
      />
      {/* 하단 CTA(디자인에 따라 BuyingFooter가 fixed 버튼을 포함할 수도 있음) */}
      {!isPaymentCompleted ? (
        <BuyingFooter
          onClickPayment={() => item && handleFooterClick()}
          disabled={!item || confirming || isPaymentCompleted}
        />
      ) : null}
    </>
  );
}
