'use client';

import styles from './toast.module.scss';

interface ToastProps {
  children: React.ReactNode;
  type?: 'error' | 'success' | 'warning' | 'info';
}

export default function Toast({ children, type = 'error' }: ToastProps) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toast_content}>
        <div className={styles.toast_icon}>
          {type === 'error' && <span className={styles.error_icon}>⚠</span>}
          {type === 'success' && <span className={styles.success_icon}>✓</span>}
          {type === 'warning' && <span className={styles.warning_icon}>!</span>}
          {type === 'info' && <span className={styles.info_icon}>ℹ</span>}
        </div>
        <div className={styles.toast_message}>{children}</div>
      </div>
    </div>
  );
}
