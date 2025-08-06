'use client';

import styles from './signup.module.scss';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className={styles.signup_container}>
      <SignupForm />
    </main>
  );
}
