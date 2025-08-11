'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, createContext, useContext } from 'react';
import { useUserStore } from '@/store/userStore';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PaymentHeader from '@/components/Payments/PaymentHeader/PaymentHeader';

// 전역 상태 타입 정의
interface GlobalState {
  session: any; // NextAuth Session 타입
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: any; // UserStore User 타입
  isLoading: boolean;
  error: string | null;
  fetchUserData: (userId: string) => Promise<void>;
  updateUserPoint: (newPoint: number) => void;
  updateMarketingConsent: (consent: boolean) => void;
}

// 전역 상태 컨텍스트 생성
const GlobalContext = createContext<GlobalState | null>(null);

// 전역 상태 훅
export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalState must be used within GlobalProvider');
  }
  return context;
};

// 전역 상태 프로바이더 컴포넌트
function GlobalProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user, isLoading, error, fetchUserData, updateUserPoint, updateMarketingConsent, setUser } = useUserStore();
  
  // 세션과 UserStore 동기화
  useEffect(() => {
    if (session?.user && !user) {
      // session.user를 UserStore의 User 타입에 맞게 변환 (기본값만 설정)
      const userData = {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        nickname: session.user.nickname || '',
        deletedAt: null,
        createdAt: null,
        marketing: false,
        sns: false,
        profileImage: null,
        point: 0,
        isActive: true
      };
      setUser(userData);
      
      // 실제 DB 데이터 가져오기
      fetchUserData(session.user.id);
    }
  }, [session, user, setUser, fetchUserData]);
  
  // 사용자 정보 콘솔 출력
  useEffect(() => {
    if (user) {
      console.log('🔍 LayoutWrapper - 사용자 정보:', {
        id: user.id,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        point: user.point,
        marketing: user.marketing,
        sns: user.sns,
        isActive: user.isActive,
        createdAt: user.createdAt,
        profileImage: user.profileImage
      });
    } else {
      console.log('🔍 LayoutWrapper - 사용자 정보 없음');
    }
  }, [user]);
  
  return (
    <GlobalContext.Provider value={{ 
      session, 
      status, 
      user, 
      isLoading, 
      error, 
      fetchUserData, 
      updateUserPoint, 
      updateMarketingConsent 
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

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
  const hideHeaderPaths = [
    '/login', 
    '/signup', 
    '/find-email', 
    '/find-password'
  ];

  // 푸터만 숨길 경로들  
  const hideFooterPaths = [
    '/products',
    '/cart',
    '/payments',
    '/search'
  ];

  // 헤더와 푸터 모두 숨길 경로들
  const hideAllLayoutPaths = [
    '/login', 
    '/signup', 
    '/find-email', 
    '/find-password'
  ];

  const shouldHideHeader = hideHeaderPaths.some((path) => pathname.startsWith(path)) || 
                          hideAllLayoutPaths.some((path) => pathname.startsWith(path));

  const shouldHideFooter = hideFooterPaths.some((path) => pathname.startsWith(path)) || 
                          hideAllLayoutPaths.some((path) => pathname.startsWith(path));

  const paymentsHeaderPaths = ['/payments/checkout'].some(path => pathname.startsWith(path));

  // 하이드레이션 완료 전까지는 로딩 표시
  if (!mounted) {
    return <div>Loading...</div>;
  }


  if (paymentsHeaderPaths) {
    return (
      <QueryClientProvider client={queryClient}>
        <PaymentHeader />
        <SessionProvider>
          <GlobalProvider>
            {children}
          </GlobalProvider>
        </SessionProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <GlobalProvider>
          {!shouldHideHeader && <Header />}
          {children}
          {!shouldHideFooter && <Footer />}
        </GlobalProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
