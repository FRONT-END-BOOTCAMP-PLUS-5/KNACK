import styles from './FailPage.module.scss'

export default function PaymentFail() {
    return (
        <div className={styles.fail}>
            <h2>❌ 결제가 실패했습니다.</h2>
        </div>
    )
}
