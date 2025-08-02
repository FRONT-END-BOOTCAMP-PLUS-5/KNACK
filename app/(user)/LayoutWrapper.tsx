'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import Header from '../components/common/header/Header';
import Footer from '../components/common/footer/Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // 헤더와 푸터를 숨길 경로들 (auth 그룹)
  const hideLayoutPaths = ['/login', '/signup', '/find-email', '/find-password'];
  const shouldHideLayout = hideLayoutPaths.some(path => pathname.startsWith(path));
  
  if (shouldHideLayout) {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    );
  }
  
  return (
    <SessionProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </SessionProvider>
  );
} 