// 에러 메시지
export const AUTH_ERROR_MESSAGES = {
  INVALID_EMAIL: '올바른 이메일을 입력해주세요.',
  INVALID_PASSWORD: '영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-20자)',
  LOGIN_FAILED: '로그인에 실패했습니다.',
  LOGIN_REQUIRED: '로그인이 필요한 서비스입니다.',
} as const;

// 정규식
export const AUTH_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
} as const;

// 소셜 로그인 제공자
export const SOCIAL_LOGIN_PROVIDERS = [
  {
    name: 'kakao',
    icon: '/kakaotalk_logo.svg',
    label: '카카오톡 로그인',
  },
  {
    name: 'google',
    icon: '/google_logo.svg',
    label: '구글 로그인',
  },
] as const; 