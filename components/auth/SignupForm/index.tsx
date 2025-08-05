'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signupForm.module.scss';
import AgreementCheckbox from '@/components/common/AgreementCheckbox';
import { useSignupForm } from '@/hooks/useSignupForm';
import { useSignup } from '@/hooks/useSignup';

export default function SignupForm() {
  const router = useRouter();
  const signupMutation = useSignup();
  const {
    formData,
    errors,
    agreements,
    isCheckingEmail,
    isCheckingNickname,
    handleInputChange,
    handleAgreementChange,
    validateForm,
    isFormValid,
    setSignupError,
    clearSignupError,
  } = useSignupForm();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearSignupError();

    // 유효성 검사
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (!agreements.age || !agreements.terms || !agreements.privacy) {
      setSignupError('필수 동의 항목에 모두 동의해주세요.');
      return;
    }

    try {
      // TanStack Query mutation 사용
      await signupMutation.mutateAsync(formData);
      
      // 성공 시 로그인 페이지로 이동
      router.push('/login');
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
    }
  }, [formData, agreements, validateForm, setSignupError, clearSignupError, router, signupMutation]);

  return (
    <form className={styles.signup_form} onSubmit={handleSubmit}>
      <h1 className={styles.signup_title}>회원가입</h1>
      
      <div className={styles.input_group}>
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange('name')}
          placeholder="이름을 입력하세요"
          className={errors.name ? styles.input_error : ''}
        />
        {errors.name && <span className={styles.error_message}>{errors.name}</span>}
      </div>

      <div className={styles.input_group}>
        <label htmlFor="email">이메일</label>
        <div className={styles.input_wrapper}>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder="이메일을 입력하세요"
            className={`${errors.email ? styles.input_error : ''} ${styles.input_with_status}`}
          />
          {isCheckingEmail && formData.email && (
            <span className={styles.checking_indicator}>검사중...</span>
          )}
        </div>
        {errors.email && <span className={styles.error_message}>{errors.email}</span>}
      </div>

      <div className={styles.input_group}>
        <label htmlFor="nickname">닉네임</label>
        <div className={styles.input_wrapper}>
          <input
            id="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleInputChange('nickname')}
            placeholder="닉네임을 입력하세요"
            className={`${errors.nickname ? styles.input_error : ''} ${styles.input_with_status}`}
          />
          {isCheckingNickname && formData.nickname && (
            <span className={styles.checking_indicator}>검사중...</span>
          )}
        </div>
        {errors.nickname && <span className={styles.error_message}>{errors.nickname}</span>}
      </div>

      <div className={styles.input_group}>
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          placeholder="비밀번호를 입력하세요"
          className={errors.password ? styles.input_error : ''}
        />
        {errors.password && <span className={styles.error_message}>{errors.password}</span>}
      </div>

      <AgreementCheckbox
        agreements={agreements}
        onAgreementChange={handleAgreementChange}
      />

      {errors.signup && <span className={styles.signup_error}>{errors.signup}</span>}

      <button
        type="submit"
        className={`${styles.signup_button} ${isFormValid() ? styles.active : ''}`}
        disabled={!isFormValid() || isCheckingEmail || isCheckingNickname}
      >
        {(isCheckingEmail || isCheckingNickname) ? '검사 중...' : '회원가입'}
      </button>
    </form>
  );
} 