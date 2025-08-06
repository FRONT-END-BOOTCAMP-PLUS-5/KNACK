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
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  return result;
}; 