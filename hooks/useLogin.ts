import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/services/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      console.log('로그인 성공:', result);
      window.location.href = '/';
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
    },
  });
}; 