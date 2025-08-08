export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    nickname: string;
    roles: string[];
    deletedAt: Date | null;
    isActive: boolean;
  };
} 