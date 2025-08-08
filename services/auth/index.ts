import { signIn } from 'next-auth/react';
import { post } from '@/utils/requester';
import { SignupFormData, SignupResponse, LoginFormData } from '@/types/auth';

// API 호출 함수 - 회원가입
export const signupUser = async (formData: SignupFormData): Promise<SignupResponse> => {
  try {
    const data = await post<SignupResponse>('/api/auth/signup', formData);
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
  }
};

// API 호출 함수 - 로그인
export const loginUser = async (formData: LoginFormData) => {
  const result = await signIn('credentials', {
    email: formData.email,
    password: formData.password,
    redirect: false,
  });

  if (!result?.ok) {
    // NextAuth.js에서 반환하는 에러 메시지 사용
    const errorMessage = result?.error || '이메일 또는 비밀번호가 올바르지 않습니다.';
    
    // 탈퇴한 계정 에러인 경우 커스텀 메시지로 변환
    if (errorMessage === 'WITHDRAWN_ACCOUNT_ERROR') {
      throw new Error('탈퇴한 계정입니다. 재가입이 필요합니다.');
    }
    
    // 없는 아이디/틀린 비밀번호 에러인 경우 커스텀 메시지로 변환
    if (errorMessage === 'INVALID_CREDENTIALS_ERROR') {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    
    throw new Error(errorMessage);
  }

  return result;
};

// API 호출 함수 - 회원탈퇴
export const withdrawUser = async (password: string) => {
  try {
    const data = await post('/api/withdrawal', { password });
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '회원탈퇴에 실패했습니다.');
  }
}; 