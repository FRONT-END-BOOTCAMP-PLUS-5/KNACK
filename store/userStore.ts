import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  deletedAt: Date | null;
  createdAt: Date | null;
  marketing: boolean;
  sns: boolean;
  profileImage: string | null;
  point: number;
  isActive: boolean;
  nickname: string;
}

interface UserStore {
  // 상태
  user: User | null;
  reviewCount: number | null; // 사용자의 리뷰 수 추가
  isLoading: boolean;
  error: string | null;

  // 액션들
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  fetchUserData: () => Promise<void>;
  // 리뷰 수만 업데이트하는 액션 추가 (리뷰 작성/삭제 시 사용)
  updateReviewCount: (count: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // 초기 상태
  user: null,
  reviewCount: null, // 리뷰 수 초기값
  isLoading: false,
  error: null,

  // 사용자 정보 설정
  setUser: (user) => set({ user, error: null }),

  // 사용자 정보 부분 업데이트
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  // 사용자 정보 초기화
  clearUser: () => set({ user: null, reviewCount: null, error: null }),

  // 리뷰 수 업데이트 (리뷰 작성/삭제 시 사용)
  updateReviewCount: (count: number) => set({ reviewCount: count }),

  // 서버에서 사용자 정보와 리뷰 수를 함께 가져오기
  fetchUserData: async () => {
    set({ isLoading: true, error: null });

    try {
      // 1. 사용자 프로필 정보 가져오기
      const profileResponse = await fetch('/api/user/profile');

      if (!profileResponse.ok) {
        console.error('API Response Error:', {
          status: profileResponse.status,
          statusText: profileResponse.statusText,
          url: profileResponse.url
        });
        throw new Error(`사용자 정보 조회 실패 (${profileResponse.status}: ${profileResponse.statusText})`);
      }

      const profileData = await profileResponse.json();
      
      // 2. 사용자 리뷰 수 가져오기 (사용자 ID가 있을 때만)
      let reviewCount = 0;
      if (profileData.user?.id) {
        try {
          const reviewResponse = await fetch('/api/reviews/orders');
          if (reviewResponse.ok) {
            const reviewData = await reviewResponse.json();
            // API 응답 구조에 맞게 수정: data 래퍼 없음
            reviewCount = reviewData.myReviews?.length || 0;
          }
        } catch (reviewError) {
          console.error('리뷰 수 조회 실패:', reviewError);
          // 리뷰 수 조회 실패해도 사용자 정보는 설정
          reviewCount = 0;
        }
      }

      // 3. 사용자 정보와 리뷰 수를 함께 설정
      set({ 
        user: profileData.user, 
        reviewCount: reviewCount,
        isLoading: false 
      });
    } catch (error) {
      console.error('Fetch User Data Error:', error);
      set({
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        isLoading: false,
      });
    }
  },
}));
