// 회원탈퇴 관련 타입 정의

// 동의 항목 타입
export interface WithdrawalAgreements {
  delete: boolean;      // 회원 정보 삭제 동의
  retention: boolean;   // 정보 보관 정책 동의  
  withdraw: boolean;    // 탈퇴 동의
}

// 회원탈퇴 요청 타입
export interface WithdrawalRequest {
  password: string;
}

// 회원탈퇴 응답 타입
export interface WithdrawalResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    deletedAt: Date | null;
    isActive: boolean;
  };
}

// 탈퇴 페이지 Props 타입 (컨벤션에 따라 IProps)
export interface IProps {
  // 페이지 내에서만 필요한 props가 있다면 여기에 추가
}

// 탈퇴 관련 에러 타입
export type WithdrawalError = {
  message: string;
  code?: string;
};
