import { WithdrawUser, WithdrawResult } from '@/backend/withdrawal/domains/entities/Withdraw';

export interface WithdrawRepository {
  /* 사용자 ID로 사용자 정보 조회 */
  findById(id: string): Promise<WithdrawUser | null>;
  
  /* 사용자 이메일로 사용자 정보 조회 */
  findByEmail(email: string): Promise<WithdrawUser | null>;
  
  /* 회원탈퇴 처리 (deletedAt, isActive 업데이트) */
  withdrawUser(id: string): Promise<WithdrawResult>;
}



