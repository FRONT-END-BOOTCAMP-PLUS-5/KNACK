'use client';

import { useState } from 'react';
import { WithdrawalAgreements } from '@/types/withdrawal';
import styles from './withdrawalForm.module.scss';
import { useToastStore } from '@/store/toastStore';

interface IProps {
  onSubmit: (password: string) => void;
  isPending: boolean;
}

export default function WithdrawalForm({ onSubmit, isPending }: IProps) {
  const { setOnToast } = useToastStore();

  const [password, setPassword] = useState('');
  const [agreements, setAgreements] = useState<WithdrawalAgreements>({
    delete: false,
    retention: false,
    withdraw: false,
  });

  const isAllAgreed = agreements.delete && agreements.retention && agreements.withdraw;

  const handleAgreementChange = (type: keyof WithdrawalAgreements) => {
    setAgreements((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (!password.trim()) {
      setOnToast(true, '비밀번호를 입력해주세요.');
      return;
    }

    if (!isAllAgreed) {
      setOnToast(true, '모든 동의 항목에 체크해주세요.');
      return;
    }

    onSubmit(password);
  };

  return (
    <div className={styles.withdrawal_form}>
      {/* 비밀번호 입력 */}
      <div className={styles.password_section}>
        <label htmlFor="password" className={styles.password_label}>
          비밀번호 확인
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="현재 비밀번호를 입력해주세요"
          className={styles.password_input}
        />
      </div>

      {/* 동의 체크박스 */}
      <div className={styles.agreement_section}>
        <div className={styles.agreement_item}>
          <input
            type="checkbox"
            id="delete_agreement"
            className={styles.agreement_checkbox}
            checked={agreements.delete}
            onChange={() => handleAgreementChange('delete')}
          />
          <label htmlFor="delete_agreement" className={styles.agreement_label}>
            회원 정보 및 서비스 이용 기록 삭제 안내를 확인하였습니다.
          </label>
        </div>
        <div className={styles.agreement_item}>
          <input
            type="checkbox"
            id="retention_agreement"
            className={styles.agreement_checkbox}
            checked={agreements.retention}
            onChange={() => handleAgreementChange('retention')}
          />
          <label htmlFor="retention_agreement" className={styles.agreement_label}>
            정보 보관 정책을 확인하였습니다.
          </label>
        </div>
        <div className={styles.agreement_item}>
          <input
            type="checkbox"
            id="withdraw_agreement"
            className={styles.agreement_checkbox}
            checked={agreements.withdraw}
            onChange={() => handleAgreementChange('withdraw')}
          />
          <label htmlFor="withdraw_agreement" className={styles.agreement_label}>
            회원탈퇴 안내를 모두 확인하였으며 탈퇴에 동의합니다.
          </label>
        </div>
      </div>

      {/* 버튼 */}
      <div className={styles.button_section}>
        <button
          className={`${styles.withdraw_button} ${isAllAgreed && password ? styles.active : ''}`}
          disabled={!isAllAgreed || !password || isPending}
          onClick={handleSubmit}
        >
          {isPending ? '탈퇴 처리 중...' : '탈퇴하기'}
        </button>
      </div>
    </div>
  );
}
