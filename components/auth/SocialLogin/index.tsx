'use client';

import { signIn } from 'next-auth/react';
import styles from './socialLogin.module.scss';
import { SOCIAL_LOGIN_PROVIDERS } from '@/constraint/auth';

export default function SocialLogin() {
  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 로그인 시도`);
    
    // 구글 로그인
    if (provider === 'google') {
      signIn('google', { callbackUrl: '/' });
    }
    // 카카오 로그인
    else if (provider === 'kakao') {
      signIn('kakao', { callbackUrl: '/' });
    }
  };

  return (
    <div className={styles.social_login}>
      {SOCIAL_LOGIN_PROVIDERS.map((provider) => (
        <button
          key={provider.name}
          className={`${styles.social_button} ${styles[`${provider.name}Button`]}`}
          onClick={() => handleSocialLogin(provider.name)}
        >
          <img src={provider.icon} alt={`${provider.name} 로고`} className={styles.social_icon} />
          <span>{provider.label}</span>
        </button>
      ))}
    </div>
  );
} 