import { UserAuth, User } from '@/backend/auth/domains/entities/SocialLogin';

export interface SocialLoginRepository {
  // 소셜 계정으로 사용자 인증 정보 찾기
  findByProviderAndProviderId(provider: string, providerId: string): Promise<UserAuth | null>;
  
  // 이메일로 사용자 찾기
  findUserByEmail(email: string): Promise<User | null>;
  
  // ID로 사용자 찾기
  findUserById(id: string): Promise<User | null>;
  
  // 새로운 사용자 생성
  createUser(userData: {
    email: string;
    name: string;
    nickname: string;
    password: string;
    profileImage?: string;
  }): Promise<User>;
  
  // 소셜 계정 정보 생성
  createUserAuth(authData: {
    provider: string;
    providerId: string;
    userId: string;
    passwordHash: string;
  }): Promise<UserAuth>;
}
