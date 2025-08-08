/* 탈퇴 처리할 사용자 데이터 */
export interface WithdrawData {
  id: string;
  email: string;
  password: string;
}

/* 탈퇴 처리 결과 데이터 */
export interface WithdrawResult {
  id: string;
  email: string;
  deletedAt: Date | null;
  isActive: boolean;
}

/* 탈퇴 처리할 사용자 데이터 */
export interface WithdrawUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
  password: string;
  createdAt: Date | null;
  deletedAt: Date | null;
  isActive: boolean;
}



