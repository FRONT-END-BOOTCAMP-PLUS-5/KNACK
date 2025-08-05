'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signup.module.scss';
import AuthInput from '@/components/common/AuthInput';
import AgreementCheckbox from '@/components/common/AgreementCheckbox';
import { useSignupForm } from '@/hooks/useSignupForm';
import { useSignup } from '@/hooks/useSignup';

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignup();
  const {
    formData,
    errors,
    agreements,
    handleInputChange,
    handleClearEmail,
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
  }, [formData, agreements, validateForm, isFormValid, setSignupError, clearSignupError, router, signupMutation]);

  return (
    <main className={styles.signup_container}>
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

        <AuthInput
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="이메일을 입력하세요"
          error={errors.email}
          onClear={handleClearEmail}
        />

        <div className={styles.input_group}>
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleInputChange('nickname')}
            placeholder="닉네임을 입력하세요"
            className={errors.nickname ? styles.input_error : ''}
          />
          {errors.nickname && <span className={styles.error_message}>{errors.nickname}</span>}
        </div>

        <AuthInput
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          placeholder="비밀번호를 입력하세요"
          error={errors.password}
        />

        {errors.password && (
          <span className={styles.hint_message}>
            영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-20자)
          </span>
        )}

        <AgreementCheckbox
          agreements={agreements}
          onAgreementChange={handleAgreementChange}
        />

        {errors.signup && <span className={styles.signup_error}>{errors.signup}</span>}

        <button
          type="submit"
          className={`${styles.signup_button} ${isFormValid() ? styles.active : ''}`}
          disabled={!isFormValid()}
        >
          회원가입
        </button>
      </form>
    </main>
  );
}
