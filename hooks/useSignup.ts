import { useMutation } from '@tanstack/react-query';
import { signupUser } from '@/services/auth';

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      console.log('회원가입 성공:', data);
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
    },
  });
}; 