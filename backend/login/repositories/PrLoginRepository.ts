import { prisma } from '@/lib/prisma';
import { LoginRepository } from '@/backend/login/domains/repositories/LoginRepository';
import { Login } from '@/backend/login/domains/entities/Login';

export class PrLoginRepository implements LoginRepository {
  async findByEmail(email: string): Promise<Login | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        nickname: true,
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      nickname: user.nickname,
    };
  }
} 