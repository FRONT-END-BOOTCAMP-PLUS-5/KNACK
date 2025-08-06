import { Login } from '@/backend/login/domains/entities/Login';

export interface LoginRepository {
  findByEmail(email: string): Promise<Login | null>;
} 