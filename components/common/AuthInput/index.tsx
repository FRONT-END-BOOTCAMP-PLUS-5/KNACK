'use client';

import { useState } from 'react';
import styles from './authInput.module.scss';

interface IProps {
  id: string;
  type: 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  onClear?: () => void;
}

export default function AuthInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  error,
  onClear,
}: IProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>
        {type === 'email' ? '이메일 주소' : '비밀번호'}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={error ? styles.inputError : ''}
        />
        {type === 'email' && value && onClear && (
          <button type="button" onClick={onClear} className={styles.clearButton}>
            ×
          </button>
        )}
        {type === 'password' && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className={styles.passwordToggle}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
} 