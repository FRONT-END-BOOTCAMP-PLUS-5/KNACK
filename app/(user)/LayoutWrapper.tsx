'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PaymentHeader from '@/components/Payments/PaymentHeader/PaymentHeader';
import { useUserStore } from '@/store/userStore';

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

  // 세션 사용 (NextAuth에서 직접 관리)
  const { data: session, status } = useSession();
  const { fetchUserData } = useUserStore();

  // 로그인 체크 → 사용자 정보 가져오기 → userStore에 저장
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
    }
  }, [session, status, fetchUserData]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 헤더만 숨길 경로들
  const hideHeaderPaths = ['/login', '/signup', '/find-email', '/find-password', '/my/address', '/saved'];

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
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {!shouldHideHeader && <Header />}
      {children}
      {!shouldHideFooter && <Footer />}
    </QueryClientProvider>
  );
}
