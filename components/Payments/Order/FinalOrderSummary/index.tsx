import { FinalOrderSummaryProps } from '@/types/order'
import styles from './finalOrderSummary.module.scss'

export default function FinalOrderSummary({
    price,
    fee = 0,
    shippingFee,
    couponAmount = 0,
    pointAmount = 0,
}: FinalOrderSummaryProps) {
    const total = price + fee + shippingFee - couponAmount - pointAmount

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
                    <div className={styles.label}>쿠폰 사용</div>
                    <div className={`${styles.value} ${couponAmount > 0 ? '' : styles.dash}`}>
                        {couponAmount > 0 ? `-${couponAmount.toLocaleString()}원` : '-'}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.label}>포인트 사용</div>
                    <div className={`${styles.value} ${pointAmount > 0 ? '' : styles.dash}`}>
                        {pointAmount > 0 ? `-${pointAmount.toLocaleString()}원` : '-'}
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
