// 소셜 로그인 사용자 인증 정보
export interface UserAuth {
  id: number;
  provider: string;
  providerId: string;
  passwordHash: string;
  userId: string;
}

// 소셜 로그인 사용자 정보
export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  password: string;
  profileImage?: string;
  deletedAt: Date | null;
  isActive: boolean;
  createdAt: Date | null;
}
