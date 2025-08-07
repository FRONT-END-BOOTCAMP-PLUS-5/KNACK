import requester from '@/utils/requester';
import { WithdrawalRequest, WithdrawalResponse } from '@/types/withdrawal';

// 회원탈퇴 API 호출 함수
export const withdrawUser = async (password: string): Promise<WithdrawalResponse> => {
  const requestData: WithdrawalRequest = { password };
  
  const response = await requester.post<WithdrawalResponse>('/api/withdrawal', requestData);
  return response.data;
};
