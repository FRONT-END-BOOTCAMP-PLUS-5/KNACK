import styles from './buyingList.module.scss';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { useRouter } from 'next/navigation';
import { Payment } from '@/types/payment';
import { formatKST } from '@/utils/orders';
import Divider from '@/components/common/Divider';
import Text from '@/components/common/Text';
import React from 'react';

export default function BuyingList({ items }: { items: Payment[] }) {
  const router = useRouter();

  return (
    <>
      <section className={styles.buying_list_section}>
        {items.map((payment) => {
          const displayDate = formatKST(payment.approvedAt ?? payment.createdAt);

          return (
            <React.Fragment key={payment.id}>
              <Divider />
              <article className={styles.payment_block}>
                {/* 결제 헤더: 결제번호 + 구매확정(승인) 날짜 */}
                <header
                  className={styles.payment_header}
                  onClick={() => router.push(`/my/order/${payment.paymentNumber}`)}
                >
                  <div className={styles.payment_left}>
                    <Text size={1.2} weight={600}>
                      결제번호 {payment.paymentNumber}
                    </Text>
                  </div>
                  <div className={styles.payment_right}>
                    <span className={styles.payment_date}>{displayDate}</span>
                    <span className={styles.chevron} aria-hidden>
                      ›
                    </span>
                  </div>
                </header>

                {/* 결제 내 상품들 */}
                {payment.orders.map((order) => {
                  const statusText = order.deliveryStatus === 4 ? '배송 완료' : '배송 중';
                  const optionText = order?.optionValue ?? order?.optionValue ?? '';

                  return (
                    <div
                      key={order.id}
                      className={styles.item_row}
                      onClick={() => router.push(`/my/buying/${order.id}`)}
                    >
                      <Image
                        src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${order?.thumbnailImage ?? ''}`}
                        alt=""
                        width={80}
                        height={80}
                        className={styles.thumb}
                      />
                      <div className={styles.item_body}>
                        <div className={styles.title_line}>
                          <Text size={1.3}>{order?.engName ?? ''}</Text>
                        </div>
                        {optionText && (
                          <Text size={1.2} weight={600}>
                            {optionText}
                          </Text>
                        )}
                      </div>

                      <div className={styles.status_area}>
                        <Text size={1.3}>{statusText}</Text>
                        {order.tracking ? (
                          <button
                            type="button"
                            className={styles.tracking_link}
                            onClick={(e) => {
                              e.stopPropagation();
                              // 필요 시 실제 운송장 조회 URL로 교체
                              window.open(`/tracking/${order.id}`, '_blank');
                            }}
                          >
                            배송조회
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </article>
            </React.Fragment>
          );
        })}
      </section>
    </>
  );
}
