'use client';

import { useState } from 'react';
import styles from './withdrawa.module.scss';

export default function WithdrawPage() {
  const [agreements, setAgreements] = useState({
    delete: false,
    retention: false,
    withdraw: false,
  });

  const isAllAgreed = agreements.delete && agreements.retention && agreements.withdraw;

  const handleAgreementChange = (type: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className={styles.withdraw_container}>
      <div className={styles.withdraw_content}>
        <h1 className={styles.withdraw_title}>회원탈퇴</h1>

        {/* 회원 정보 삭제 안내 */}
        <div className={styles.withdraw_restriction}>
          <h2 className={styles.delete_title}>회원 정보 및 서비스 이용 기록 삭제 안내</h2>
          <p className={styles.delete_desc}>
            KNACK을 탈퇴하면 회원 정보와 서비스 이용 기록이 삭제됩니다.
          </p>
          <div className={styles.delete_list}>
            <div className={styles.delete_item}>
              <span className={styles.delete_text}>내 프로필</span>
            </div>
            <div className={styles.delete_item}>
              <span className={styles.delete_text}>거래내역 (구매/판매)</span>
            </div>
            <div className={styles.delete_item}>
              <span className={styles.delete_text}>관심상품</span>
            </div>
            <div className={styles.delete_item}>
              <span className={styles.delete_text}>보유상품</span>
            </div>
            <div className={styles.delete_item}>
              <span className={styles.delete_text}>리뷰 및 댓글</span>
            </div>
            <div className={styles.delete_item}>
              <span className={styles.delete_text}>미사용 보유 포인트 등</span>
            </div>
          </div>
          <p className={styles.delete_warning}>
            이러한 정보들은 탈퇴 시 모두 사라지며, 재가입하더라도 복구가 불가능합니다.
          </p>
          <p className={styles.delete_limit}>
            탈퇴 후 14일 이내에는 재가입할 수 없으며, 탈퇴 후에는 동일한 이메일로 재가입할 수 없습니다.
          </p>
        </div>

        {/* 정보 보관 정책 */}
        <div className={styles.retention_policy}>
          <h2 className={styles.retention_title}>정보 보관 정책 (관련 법령 및 내부 기준에 따름)</h2>
          <p className={styles.retention_desc}>
            일부 정보는 관련 법령 및 내부 기준에 따라 별도로 보관될 수 있습니다.
          </p>
          <div className={styles.retention_list}>
            <div className={styles.retention_item}>
              <h3 className={styles.retention_subtitle}>1. 전자상거래 등 소비자 보호에 관한 법률</h3>
              <ul className={styles.retention_ul}>
                <li>계약 또는 청약철회 등에 관한 기록: 5년 보관</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 보관</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 보관</li>
              </ul>
            </div>
            <div className={styles.retention_item}>
              <h3 className={styles.retention_subtitle}>2. 통신비밀보호법</h3>
              <ul className={styles.retention_ul}>
                <li>접속 로그 기록: 3개월 보관</li>
              </ul>
            </div>
            <div className={styles.retention_item}>
              <h3 className={styles.retention_subtitle}>3. 내부 기준에 따라 별도 보관</h3>
              <ul className={styles.retention_ul}>
                <li>부정이용 방지를 위해 이름, 이메일(로그인ID), 휴대전화번호, CI/DI: 3년 보관</li>
              </ul>
            </div>
          </div>
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
            className={`${styles.withdraw_button} ${isAllAgreed ? styles.active : ''}`}
            disabled={!isAllAgreed}
          >
            탈퇴하기
          </button>
          <button className={styles.cancel_button}>취소하기</button>
        </div>
      </div>
    </div>
  );
}