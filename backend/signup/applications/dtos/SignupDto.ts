export interface SignupRequestDto {
  name: string;
  email: string;
  nickname: string;
  password: string;
}

export interface SignupResponseDto {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    nickname: string;
    createdAt: Date | null;
  };
} 