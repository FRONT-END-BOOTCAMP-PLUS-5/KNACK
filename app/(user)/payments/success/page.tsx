import styles from './SuccessPage.module.scss'

export default function PaymentSuccess() {
    return (
        <div className={styles.success}>
            <h2>✅ 결제가 완료되었습니다.</h2>
        </div>
    )
}
