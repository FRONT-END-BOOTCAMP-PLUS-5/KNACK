'use client';

import styles from './socialLogin.module.scss';
import { SOCIAL_LOGIN_PROVIDERS } from '@/constraint/auth';

export default function SocialLogin() {
  const handleSocialLogin = (provider: string) => {
    // TODO: 소셜 로그인 구현
    console.log(`${provider} 로그인 시도`);
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