import { useMutation } from '@tanstack/react-query';
import { withdrawUser } from '@/services/withdrawal';

export const useWithdraw = () => {
  return useMutation({
    mutationFn: withdrawUser,
    onSuccess: (data) => {
      console.log('회원탈퇴 성공:', data);
      // 탈퇴 성공 알림
      alert('회원탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사했습니다.');
      // 탈퇴 성공 시 로그아웃 처리
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('회원탈퇴 실패:', error);
      // 에러 메시지 표시
      alert(error instanceof Error ? error.message : '회원탈퇴에 실패했습니다.');
    },
  });
};
