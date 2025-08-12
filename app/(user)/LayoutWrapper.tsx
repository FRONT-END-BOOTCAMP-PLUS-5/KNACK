'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PaymentHeader from '@/components/payments/PaymentHeader';

interface IProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: IProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // 헤더만 숨길 경로들
  const hideHeaderPaths = ['/login', '/signup', '/find-email', '/find-password', '/my/address'];

  // 푸터만 숨길 경로들
  const hideFooterPaths = ['/products', '/cart', '/payments', '/search'];

  // 헤더와 푸터 모두 숨길 경로들
  const hideAllLayoutPaths = ['/login', '/signup', '/find-email', '/find-password'];

  const shouldHideHeader =
    hideHeaderPaths.some((path) => pathname.startsWith(path)) ||
    hideAllLayoutPaths.some((path) => pathname.startsWith(path));

  const shouldHideFooter =
    hideFooterPaths.some((path) => pathname.startsWith(path)) ||
    hideAllLayoutPaths.some((path) => pathname.startsWith(path));

  const paymentsHeaderPaths = ['/payments/checkout'].some((path) => pathname.startsWith(path));

  // 하이드레이션 완료 전까지는 로딩 표시
  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (paymentsHeaderPaths) {
    return (
      <QueryClientProvider client={queryClient}>
        <PaymentHeader />
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {!shouldHideHeader && <Header />}
        {children}
        {!shouldHideFooter && <Footer />}
      </SessionProvider>
    </QueryClientProvider>
  );
}
