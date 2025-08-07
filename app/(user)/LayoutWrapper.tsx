'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Header from '@/components/common/header/Header';
import Footer from '@/components/common/footer/Footer';
import CheckoutHeader from '@/components/common/PaymentHeader/PaymentHeader';

interface IProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: IProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  // 헤더와 푸터를 숨길 경로들 (auth 그룹)
  const hideLayoutPaths = ['/login', '/signup', '/find-email', '/find-password'];
  const shouldHideLayout = hideLayoutPaths.some(path => pathname.startsWith(path));

  const paymentsHeaderPaths = ['/payments/checkout'].some(path => pathname.startsWith(path));

  // 하이드레이션 완료 전까지는 로딩 표시
  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (shouldHideLayout) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </QueryClientProvider>
    );
  }

  if (paymentsHeaderPaths) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <CheckoutHeader />
          {children}
        </SessionProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Header />
        {children}
        <Footer />
      </SessionProvider>
    </QueryClientProvider>
  );
} 