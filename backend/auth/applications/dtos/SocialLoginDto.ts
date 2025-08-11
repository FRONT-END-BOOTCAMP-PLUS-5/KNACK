// 소셜 로그인 요청 DTO
export interface SocialLoginRequestDto {
  provider: string;        // 'google', 'kakao' 등
  providerId: string;      // 소셜 제공자의 고유 ID
  email: string;           // 이메일
  name: string;            // 이름
  profileImage?: string;   // 프로필 이미지 (선택사항)
}

// 소셜 로그인 응답 DTO
export interface SocialLoginResponseDto {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    nickname: string;
    roles: string[];
    deletedAt: Date | null;
    isActive: boolean;
  };
  isNewUser: boolean;      // 새로 가입한 사용자인지 여부
}
