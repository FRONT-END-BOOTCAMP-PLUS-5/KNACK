'use client';

import { AgreementState } from '@/types/auth';
import styles from './agreementCheckbox.module.scss';

interface IProps {
  agreements: AgreementState;
  onAgreementChange: (field: keyof AgreementState, checked: boolean) => void;
}

export default function AgreementCheckbox({ agreements, onAgreementChange }: IProps) {
  return (
    <div className={styles.agreement_section}>
      {/* 모두 동의 */}
      <div className={styles.agree_all_container}>
        <label className={styles.agree_all_checkbox}>
          <input
            type="checkbox"
            className={styles.agree_all_input}
            checked={agreements.all}
            onChange={(e) => onAgreementChange('all', e.target.checked)}
          />
          <div>
            <div className={styles.agree_all_label}>모두 동의합니다</div>
            <div className={styles.agree_all_subtitle}>선택 동의 항목 포함</div>
          </div>
        </label>
      </div>

      {/* 개별 동의 항목 */}
      <div className={styles.agreement_item}>
        <div className={styles.agreement_checkbox_container}>
          <input
            type="checkbox"
            className={styles.agreement_checkbox}
            checked={agreements.age}
            onChange={(e) => onAgreementChange('age', e.target.checked)}
            id="age"
          />
          <label htmlFor="age" className={styles.agreement_label}>
            <span className={styles.required_tag}>[필수]</span> 만 14세 이상입니다
          </label>
        </div>
      </div>

      <div className={styles.agreement_item}>
        <div className={styles.agreement_checkbox_container}>
          <input
            type="checkbox"
            className={styles.agreement_checkbox}
            checked={agreements.terms}
            onChange={(e) => onAgreementChange('terms', e.target.checked)}
            id="terms"
          />
          <label htmlFor="terms" className={styles.agreement_label}>
            <span className={styles.required_tag}>[필수]</span> 이용약관 동의
          </label>
        </div>
        <a href="#" className={styles.agreement_link}>내용 보기</a>
      </div>

      <div className={styles.agreement_item}>
        <div className={styles.agreement_checkbox_container}>
          <input
            type="checkbox"
            className={styles.agreement_checkbox}
            checked={agreements.privacy}
            onChange={(e) => onAgreementChange('privacy', e.target.checked)}
            id="privacy"
          />
          <label htmlFor="privacy" className={styles.agreement_label}>
            <span className={styles.required_tag}>[필수]</span> 개인 정보 수집 및 이용 동의
          </label>
        </div>
        <a href="#" className={styles.agreement_link}>내용 보기</a>
      </div>
    </div>
  );
} 