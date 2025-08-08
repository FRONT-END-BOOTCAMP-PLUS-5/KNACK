import { prisma } from '@/lib/prisma';
import { WithdrawRepository } from '@/backend/withdrawal/domains/repositories/WithdrawRepository';
import { WithdrawUser, WithdrawResult } from '@/backend/withdrawal/domains/entities/Withdraw';

export class PrWithdrawRepository implements WithdrawRepository {
  async findById(id: string): Promise<WithdrawUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        password: true,
        createdAt: true,
        deletedAt: true,
        isActive: true,
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }

  async findByEmail(email: string): Promise<WithdrawUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        password: true,
        createdAt: true,
        deletedAt: true,
        isActive: true,
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }

  async withdrawUser(id: string): Promise<WithdrawResult> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),  // 현재 시간으로 탈퇴 날짜 설정
        isActive: false,        // 비활성화
      },
      select: {
        id: true,
        email: true,
        deletedAt: true,
        isActive: true,
      }
    });

    return {
      id: user.id,
      email: user.email,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }
}



