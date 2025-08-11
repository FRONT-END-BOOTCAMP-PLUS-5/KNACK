import { create } from 'zustand';

interface User {
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
  isLoading: boolean;
  error: string | null;
  
  // 액션들
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  fetchUserData: (userId: string) => Promise<void>;
  updateUserPoint: (newPoint: number) => void;
  updateProfileImage: (imageUrl: string) => void;
  updateMarketingConsent: (consent: boolean) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  // 초기 상태
  user: null,
  isLoading: false,
  error: null,

  // 사용자 정보 설정
  setUser: (user) => set({ user, error: null }),

  // 사용자 정보 부분 업데이트
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),

  // 사용자 정보 초기화
  clearUser: () => set({ user: null, error: null }),

  // 서버에서 사용자 정보 가져오기
  fetchUserData: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('사용자 정보 조회 실패');
      }
      
      const data = await response.json();
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        isLoading: false 
      });
    }
  },

  // 포인트 업데이트
  updateUserPoint: (newPoint) => set((state) => ({
    user: state.user ? { ...state.user, point: newPoint } : null
  })),

  // 프로필 이미지 업데이트
  updateProfileImage: (imageUrl) => set((state) => ({
    user: state.user ? { ...state.user, profileImage: imageUrl } : null
  })),

  // 마케팅 동의 업데이트
  updateMarketingConsent: (consent) => set((state) => ({
    user: state.user ? { ...state.user, marketing: consent } : null
  }))
}));
