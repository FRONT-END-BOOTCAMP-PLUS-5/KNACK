// 회원가입 폼 데이터 타입
export interface SignupFormData {
  name: string;
  email: string;
  nickname: string;
  password: string;
}

// 회원가입 응답 타입
export interface SignupResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    nickname: string;
    createdAt: Date | null;
  };
}

// 로그인 폼 데이터 타입
export interface LoginFormData {
  email: string;
  password: string;
}

// 회원가입 에러 타입
export interface SignupErrors {
  name?: string;
  email?: string;
  nickname?: string;
  password?: string;
  signup?: string;
}

// 로그인 에러 타입
export interface LoginFormErrors {
  email?: string;
  password?: string;
  login?: string;
}

// 약관 동의 상태 타입
export interface AgreementState {
  all: boolean;
  age: boolean;
  terms: boolean;
  privacy: boolean;
}
