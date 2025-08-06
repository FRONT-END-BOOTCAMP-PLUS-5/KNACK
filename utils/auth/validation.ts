import { AUTH_REGEX } from '@/constraint/auth';
import { SignupFormData, SignupErrors } from '@/types/auth';

export const validateEmail = (email: string): boolean => {
  return AUTH_REGEX.EMAIL.test(email);
};

export const validatePassword = (password: string): boolean => {
  return AUTH_REGEX.PASSWORD.test(password);
};

export const validateLoginForm = (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {};
  
  if (email && !validateEmail(email)) {
    errors.email = '올바른 이메일을 입력해주세요.';
  }
  
  if (password && !validatePassword(password)) {
    errors.password = '영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-20자)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 회원가입 전용 유효성 검사 함수들
export const validateSignupEmail = (email: string): string => {
  if (!email) return '이메일을 입력해주세요.';
  if (!validateEmail(email)) return '올바른 이메일 형식이 아닙니다.';
  return '';
};

export const validateSignupPassword = (password: string): string => {
  if (!password) return '비밀번호를 입력해주세요.';
  if (!validatePassword(password)) return '영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-20자)';
  return '';
};

export const validateName = (name: string): string => {
  if (!name) return '이름을 입력해주세요.';
  return '';
};

export const validateNickname = (nickname: string): string => {
  if (!nickname) return '닉네임을 입력해주세요.';
  return '';
};

export const validateSignupForm = (formData: SignupFormData): SignupErrors => {
  const errors: SignupErrors = {};

  errors.name = validateName(formData.name);
  errors.email = validateSignupEmail(formData.email);
  errors.nickname = validateNickname(formData.nickname);
  errors.password = validateSignupPassword(formData.password);

  return errors;
}; 