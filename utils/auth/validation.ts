import { AUTH_REGEX } from '@/constraint/auth';

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