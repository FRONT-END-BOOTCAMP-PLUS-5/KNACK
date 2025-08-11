'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from './logoutButton.module.scss';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        callbackUrl: '/', 
        redirect: true 
      });
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`${styles.logoutButton} ${className || ''}`}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? '로그아웃 중...' : '로그아웃'}
    </button>
  );
}
