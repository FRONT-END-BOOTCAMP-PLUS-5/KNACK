'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import AuthInput from '@/components/common/AuthInput';
import { useLoginValidation } from '@/hooks/useLoginValidation';
import styles from './loginForm.module.scss';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { errors, validateField, clearError, setLoginError } = useLoginValidation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateField('email', value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validateField('password', value);
  };

  const clearEmail = () => {
    setEmail('');
    clearError('email');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      username: email,
      password: password,
      redirect: false,
    });
    
    if (result?.ok) {
      window.location.href = '/';
    } else {
      setLoginError('로그인에 실패했습니다.');
    }
  };

  const isLoginButtonActive = email && password && !errors.email && !errors.password;

  return (
    <form className={styles.login_form} onSubmit={handleSubmit}>
      <AuthInput
        id="email"
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="예) admin@KNACK.co.kr"
        error={errors.email}
        onClear={clearEmail}
      />

      <AuthInput
        id="password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="비밀번호를 입력해주세요"
        error={errors.password}
      />

      {errors.login && <span className={styles.login_error}>{errors.login}</span>}

      <button 
        type="submit" 
        className={`${styles.login_button} ${isLoginButtonActive ? styles.active : ''}`}
        disabled={!isLoginButtonActive}
      >
        로그인
      </button>
    </form>
  );
} 