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
  isLoading: boolean;
  error: string | null;

  // 액션들
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  fetchUserData: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  // 초기 상태
  user: null,
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
        isLoading: false,
      });
    }
  },
}));
