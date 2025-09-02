'use client';

import { useRouter } from 'next/navigation';
import { useWithdraw } from '@/hooks/useWithdraw';
import WithdrawalInfo from '@/components/withdrawal/WithdrawalInfo';
import WithdrawalForm from '@/components/withdrawal/WithdrawalForm';
import styles from './withdrawalPage.module.scss';
import { useToastStore } from '@/store/toastStore';

export default function WithdrawalPage() {
  const router = useRouter();
  const withdrawMutation = useWithdraw();

  const { setOnToast } = useToastStore();

  const handleWithdraw = async (password: string) => {
    try {
      await withdrawMutation.mutateAsync(password);
      setOnToast(true, '회원탈퇴가 완료 되었어요.');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      setOnToast(true, error instanceof Error ? error.message : '회원탈퇴에 실패했어요.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main>
      <div className={styles.withdrawal_container}>
        <div className={styles.withdrawal_content}>
          <h1 className={styles.withdrawal_title}>회원탈퇴</h1>

          {/* 탈퇴 안내 정보 */}
          <WithdrawalInfo />

          {/* 탈퇴 폼 */}
          <WithdrawalForm onSubmit={handleWithdraw} isPending={withdrawMutation.isPending} />

          {/* 취소 버튼 */}
          <div className={styles.cancel_section}>
            <button className={styles.cancel_button} onClick={handleCancel} disabled={withdrawMutation.isPending}>
              취소하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
