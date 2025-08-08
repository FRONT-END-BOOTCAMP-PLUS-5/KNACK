export interface WithdrawRequestDto {
  password: string;  // 탈퇴 확인용 비밀번호
}

export interface WithdrawResponseDto {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    deletedAt: Date | null;
    isActive: boolean;
  };
}



