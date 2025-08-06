export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  password: string;
  createdAt: Date | null;
  deletedAt: Date | null;
  marketing: boolean;
  sns: boolean;
  profileImage: string | null;
  point: number;
  isActive: boolean;
}

export interface CreateUserData {
  email: string;
  name: string;
  nickname: string;
  password: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  nickname: string;
  createdAt: Date | null;
  deletedAt: Date | null;
  marketing: boolean;
  sns: boolean;
  profileImage: string | null;
  point: number;
  isActive: boolean;
} 