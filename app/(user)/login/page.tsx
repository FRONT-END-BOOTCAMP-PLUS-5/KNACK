import styles from './login.module.scss';
import LoginForm from '@/components/common/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';

export default function LoginPage() {

  return (
    <main className={styles.loginContainer}>

      {/* 로고 및 슬로건 */}
      <div className={styles.logoSection}>
        <h1 className={styles.logo}>KNACK</h1>
        <p className={styles.slogan}>Knowhow Nifty Art Chic</p>
      </div>

      {/* 로그인 폼 */}
      <LoginForm />

      {/* 추가 옵션 */}
      <div className={styles.additionalOptions}>
        <a href="/signup">이메일 가입</a>
        <span className={styles.divider}>|</span>
        <a href="/find-email">이메일 찾기</a>
        <span className={styles.divider}>|</span>
        <a href="/find-password">비밀번호 찾기</a>
      </div>

      {/* 소셜 로그인 */}
      <SocialLogin />
    </main>
  );
}

/* KNACK: Knowhow Nifty Art Chic

패션에 필요한 ‘요령’, 스타일리시함을 강조. */