'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import styles from './mainPage.module.scss';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PaymentHeader from '@/components/Payments/PaymentHeader';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import Loading from '@/public/images/loading.gif';
import MaterialToast, { IToastState } from '@/components/common/MaterialToast';
import { useToastStore } from '@/store/toastStore';

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

  const { onToast, setOnToast } = useToastStore();

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
  const hideHeaderPaths = ['/login', '/find-email', '/find-password', '/my/address', '/saved', '/payments/checkout'];

  // 푸터만 숨길 경로들
  const hideFooterPaths = ['/products', '/cart', '/payments', '/signup'];

  // 헤더와 푸터 모두 숨길 경로들
  const hideAllLayoutPaths = [
    '/login',
    '/my/buying',
    '/find-email',
    '/find-password',
    '/my/buying',
    '/my/order',
    '/event/fishhook',
  ];

  // nav와 검색버튼을 숨김 (검색창, 탭 네비게이션)
  const hideHeaderElementsPaths = ['/my', '/cart', '/saved', '/signup', '/products/'];

  // 기존 방식 - 새로운 설정 기반으로 대체됨 (주석 처리)
  // const showBackButtonPaths = ['/cart', '/my/profile', '/my/address', '/products/','/signup'];
  // const showHomeButtonPaths = ['/cart','/products/'];

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

  // 기존 로직은 주석 처리 (새로운 설정 기반으로 대체)
  // const shouldHideActionButtons = showBackButtonPaths.some((path) => pathname.startsWith(path));

  // 공통 헤더 설정들을 미리 정의 (중복 제거)
  const commonHeaderConfigs = {
    // 뒤로가기 버튼만 표시하는 페이지들의 공통 설정
    backButtonOnly: {
      showBackButton: true, // 뒤로가기 버튼 표시
      showHomeButton: false, // 홈 버튼 숨김
      hideActionButtons: true, // 액션 버튼들 숨김
      hideHamburgerOnly: false, // 햄버거 메뉴 표시
      showCart: false, // 장바구니 숨김
    },
    // 뒤로가기 + 홈 버튼만 표시하는 페이지들의 공통 설정 (장바구니, 햄버거 숨김)
    backHomeOnly: {
      showBackButton: true, // 뒤로가기 버튼 표시
      showHomeButton: true, // 홈 버튼 표시
      hideActionButtons: true, // 액션 버튼들 숨김 (장바구니, 햄버거 포함)
      hideHamburgerOnly: false, // 햄버거 메뉴 표시 (hideActionButtons로 제어됨)
      showCart: false, // 장바구니 숨김
    },
    // 뒤로가기 + 홈 + 장바구니를 표시하는 페이지들의 공통 설정
    backHomeCart: {
      showBackButton: true, // 뒤로가기 버튼 표시
      showHomeButton: true, // 홈 버튼 표시
      hideActionButtons: false, // 액션 버튼들 표시
      hideHamburgerOnly: false, // 햄버거 메뉴 표시
      showCart: true, // 장바구니 표시
    },
  };
  // 페이지별 헤더 설정을 객체로 관리 (확장성 고려)
  // 새로운 페이지 추가 시 이 객체에만 설정을 추가하면 됨
  const pageHeaderConfig = {
    // 상품 페이지: 뒤로가기 + 홈 + 장바구니 (햄버거 메뉴만 숨김)
    '/products': {
      ...commonHeaderConfigs.backHomeCart, // 공통 설정 상속
      hideHamburgerOnly: true, // 햄버거 메뉴만 숨김 (오버라이드)
    },
    // 장바구니 페이지: 뒤로가기 + 홈 버튼만 (장바구니, 햄버거 숨김)
    '/cart': commonHeaderConfigs.backHomeOnly,
    // 프로필, 주소록, 회원가입 페이지: 뒤로가기만 (다른 버튼들 모두 숨김)
    '/my/profile': commonHeaderConfigs.backButtonOnly,
    '/my/address': commonHeaderConfigs.backButtonOnly,
    '/signup': commonHeaderConfigs.backButtonOnly,
  };

  // 현재 페이지에 맞는 헤더 설정을 가져오는 함수
  // pathname이 pageHeaderConfig의 키와 일치하는지 확인하여 해당 설정 반환
  const getCurrentPageConfig = (pathname: string) => {
    // 설정된 경로와 일치하는지 확인
    for (const [path, config] of Object.entries(pageHeaderConfig)) {
      if (pathname.startsWith(path)) {
        return config;
      }
    }
    // 일치하는 설정이 없을 경우 기본 설정 반환
    // 기본적으로는 모든 버튼을 숨기고 장바구니만 표시
    return {
      showBackButton: false, // 뒤로가기 버튼 숨김
      showHomeButton: false, // 홈 버튼 숨김
      hideActionButtons: false, // 액션 버튼들 표시
      hideHamburgerOnly: false, // 햄버거 메뉴 표시
      showCart: true, // 장바구니 표시
    };
  };

  const currentConfig = getCurrentPageConfig(pathname);

  // 새로운 설정 기반으로 헤더 상태 결정
  const shouldShowBackButton = currentConfig.showBackButton;
  const shouldShowHomeButton = currentConfig.showHomeButton;
  const shouldHideActionButtons = currentConfig.hideActionButtons;
  const shouldHideHamburgerOnly = currentConfig.hideHamburgerOnly;
  const shouldShowCart = currentConfig.showCart;

  // 현재 페이지에 맞는 제목 가져오기
  const pageTitle = getPageTitle(pathname);

  // 로고를 보여줄지 여부 (뒤로가기 버튼이 있으면 로고 숨김)
  const shouldShowLogo = !shouldShowBackButton;

  // 결제 헤더를 보여줄 경로들 (결제 페이지에서는 다른 헤더 사용)
  const paymentsHeaderPaths = ['/payments/checkout'].some((path) => pathname.startsWith(path));

  // 하이드레이션 완료 전까지는 로딩 표시
  if (!mounted) {
    return (
      <div className={styles.loading_container}>
        <Image src={Loading} alt="loading" width={100} height={100} />
      </div>
    );
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
          hideActionButtons={shouldHideActionButtons} // 액션 버튼들 숨김 여부
          showHomeButton={shouldShowHomeButton} // 홈 버튼 표시 여부
          hideHamburgerOnly={shouldHideHamburgerOnly} // 햄버거 메뉴 숨김 여부
          showCart={shouldShowCart} // 장바구니 표시 여부
        />
      )}
      {children}
      <MaterialToast
        open={onToast?.open}
        setOpen={() => setOnToast(false, '')}
        message={onToast?.message}
        link={onToast?.link}
        autoHideDuration={3000}
      />
      {!shouldHideFooter && <Footer />}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
