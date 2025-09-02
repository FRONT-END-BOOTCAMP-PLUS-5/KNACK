import { useMutation } from '@tanstack/react-query';
import { withdrawUser } from '@/services/withdrawal';

export const useWithdraw = () => {
  return useMutation({
    mutationFn: withdrawUser,
    onSuccess: (data) => {
      console.log('회원탈퇴 성공:', data);

      // 탈퇴 성공 시 로그아웃 처리
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('회원탈퇴 실패:', error);
    },
  });
};
