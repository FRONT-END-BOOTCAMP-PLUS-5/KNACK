import { User, CreateUserData, UserWithoutPassword } from '@/backend/signup/domains/entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByNickname(nickname: string): Promise<User | null>;
  create(userData: CreateUserData): Promise<UserWithoutPassword>;
} 