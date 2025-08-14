import { FinalOrderSummaryProps } from '@/types/order'
import styles from './finalOrderSummary.module.scss'

type Props = FinalOrderSummaryProps & {
    /** (선택) 선택된 쿠폰명 표시용 */
    selectedCouponName?: string | null
}

export default function FinalOrderSummary({
    price,
    fee = 0,
    shippingFee,
    couponAmount = 0,
    pointAmount = 0,
    selectedCouponName = null,
}: Props) {
    // 1) 상품가+수수료(검수비는 별도 표기만 "무료")
    const subtotal = Math.max(0, (price || 0) + (fee || 0))

    // 2) 쿠폰/포인트 과할인 방지
    const couponApplied = Math.min(Math.max(0, couponAmount || 0), subtotal)
    const pointApplied = Math.min(Math.max(0, pointAmount || 0), Math.max(0, subtotal - couponApplied))

    // 3) 최종 결제금액
    const total = Math.max(0, subtotal + (shippingFee || 0) - couponApplied - pointApplied)

    return (
        <>
            <section className={styles.summary_box}>
                <div className={styles.row_header}>최종 주문정보</div>

                <div className={styles.row}>
                    <div className={styles.label}>구매가</div>
                    <div className={`${styles.value} ${styles.emph}`}>
                        {price.toLocaleString()}원
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.label}>검수비</div>
                    <div className={`${styles.value} ${styles.muted}`}>무료</div>
                </div>

                <div className={styles.row}>
                    <div className={styles.label}>
                        수수료 <span className={styles.tooltip} aria-label="수수료 안내">?</span>
                    </div>
                    <div className={`${styles.value} ${fee > 0 ? '' : styles.dash}`}>
                        {fee > 0 ? `${fee.toLocaleString()}원` : '-'}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.label}>배송비</div>
                    <div className={styles.value}>{shippingFee.toLocaleString()}원</div>
                </div>

                <div className={styles.row}>
                    <div className={styles.label}>
                        쿠폰 사용{selectedCouponName ? <span className={styles.subtle}> · {selectedCouponName}</span> : null}
                    </div>
                    <div className={`${styles.value} ${couponApplied > 0 ? '' : styles.dash}`}>
                        {couponApplied > 0 ? `-${couponApplied.toLocaleString()}원` : '-'}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.label}>포인트 사용</div>
                    <div className={`${styles.value} ${pointApplied > 0 ? '' : styles.dash}`}>
                        {pointApplied > 0 ? `-${pointApplied.toLocaleString()}원` : '-'}
                    </div>
                </div>
            </section>

            <div className={styles.total_bar}>
                <p className={styles.total_label}>총 결제금액</p>
                <p className={styles.total_price}>{total.toLocaleString()}원</p>
            </div>
        </>
    )
}
