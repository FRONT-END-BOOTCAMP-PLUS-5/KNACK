'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PaymentHeader from '@/components/Payments/PaymentHeader';
import { useUserStore } from '@/store/userStore';
import { BuyingHeader } from '@/components/my/BuyingHeader';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // 세션 사용 (NextAuth에서 직접 관리)
  const { data: session, status } = useSession();
  const { fetchUserData } = useUserStore();

  // 로그인 체크 → 사용자 정보 가져오기 → userStore에 저장 + 마운트 상태 설정
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
    }
    setMounted(true);
  }, [session, status, fetchUserData]);

  // 헤더만 숨길 경로들
  const hideHeaderPaths = [
    '/login',
    '/signup',
    '/find-email',
    '/find-password',
    '/my/address',
    '/saved',
    '/payments/checkout',
  ];

  // 푸터만 숨길 경로들
  const hideFooterPaths = ['/products', '/cart', '/payments'];

  // 헤더와 푸터 모두 숨길 경로들
  const hideAllLayoutPaths = [
    '/login',
    '/signup',
    '/my/buying',
    '/find-email',
    '/find-password',
    '/my/buying',
    '/my/order',
  ];

  // nav와 검색버튼을을 숨김
  const hideHeaderElementsPaths = ['/my', '/cart', '/saved'];

  // 로고를 숨기고고 뒤로가기 버튼
  const showBackButtonPaths = ['/cart', '/my/profile', '/my/address'];

  // 홈 버튼을 보여줄 경로들
  const showHomeButtonPaths = ['/cart'];

  // title 노출되는 부분
  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/my/profile')) return '로그인정보';
    if (pathname.startsWith('/my/orders')) return '주문내역';
    if (pathname.startsWith('/my/address')) return '주소록';
    if (pathname.startsWith('/cart')) return '장바구니';
    if (pathname.startsWith('/my/buying')) return '구매 진행 중';
    if (pathname.startsWith('/my/order')) return '결제 내역 상세';
    if (pathname.startsWith('/payments/checkout')) return '배송/결제';
    return undefined;
  };

  // 헤더 전체를 숨길지 여부 (로그인, 회원가입 등)
  const shouldHideHeader =
    hideHeaderPaths.some((path) => pathname.startsWith(path)) ||
    hideAllLayoutPaths.some((path) => pathname.startsWith(path));

  // 푸터를 숨길지 여부 (상품, 장바구니, 결제 등)
  const shouldHideFooter =
    hideFooterPaths.some((path) => pathname.startsWith(path)) ||
    hideAllLayoutPaths.some((path) => pathname.startsWith(path));

  // 헤더 요소들(검색창, 탭 네비게이션)을 숨길지 여부
  const shouldHideHeaderElements = hideHeaderElementsPaths.some((path) => pathname.startsWith(path));

  // 액션 버튼들(알림, 장바구니)을 숨길지 여부
  const shouldHideActionButtons = showBackButtonPaths.some((path) => pathname.startsWith(path));

  // 뒤로가기 버튼을 보여줄지 여부
  const shouldShowBackButton = showBackButtonPaths.some((path) => pathname.startsWith(path));

  // 홈 버튼을 보여줄지 여부
  const shouldShowHomeButton = showHomeButtonPaths.some((path) => pathname.startsWith(path));

  // 현재 페이지에 맞는 제목 가져오기
  const pageTitle = getPageTitle(pathname);

  // 로고를 보여줄지 여부 (뒤로가기 버튼이 있으면 로고 숨김)
  const shouldShowLogo = !shouldShowBackButton;

  // 결제 헤더를 보여줄 경로들 (결제 페이지에서는 다른 헤더 사용)
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
      {/* 헤더 렌더링: 경로에 따라 다른 헤더 설정 적용 */}
      {!shouldHideHeader && (
        <Header
          hideHeaderElements={shouldHideHeaderElements} // 검색창, 탭 네비게이션 숨김
          showBackButton={shouldShowBackButton} // 뒤로가기 버튼 표시
          pageTitle={pageTitle} // 페이지 제목
          showLogo={shouldShowLogo} // 로고 표시 여부
          hideActionButtons={shouldHideActionButtons} // 액션 버튼들 숨김(알림, 장바구니니)
          showHomeButton={shouldShowHomeButton} // 홈 버튼 표시 여부
        />
      )}
      {children}
      {!shouldHideFooter && <Footer />}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
