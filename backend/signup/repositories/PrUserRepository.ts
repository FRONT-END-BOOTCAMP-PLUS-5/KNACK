import { prisma } from '@/lib/prisma';
import { UserRepository } from '@/backend/signup/domains/repositories/UserRepository';
import { User, CreateUserData, UserWithoutPassword } from '@/backend/signup/domains/entities/User';

export class PrUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        nickname: true,
        createdAt: true,
        deletedAt: true,
        marketing: true,
        sns: true,
        profileImage: true,
        point: true,
        isActive: true,
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      nickname: user.nickname,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      marketing: user.marketing,
      sns: user.sns,
      profileImage: user.profileImage,
      point: user.point,
      isActive: user.isActive,
    };
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { nickname },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        nickname: true,
        createdAt: true,
        deletedAt: true,
        marketing: true,
        sns: true,
        profileImage: true,
        point: true,
        isActive: true,
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      nickname: user.nickname,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      marketing: user.marketing,
      sns: user.sns,
      profileImage: user.profileImage,
      point: user.point,
      isActive: user.isActive,
    };
  }

  async create(userData: CreateUserData): Promise<UserWithoutPassword> {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        nickname: userData.nickname,
        password: userData.password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        createdAt: true,
        deletedAt: true,
        marketing: true,
        sns: true,
        profileImage: true,
        point: true,
        isActive: true,
      }
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      marketing: user.marketing,
      sns: user.sns,
      profileImage: user.profileImage,
      point: user.point,
      isActive: user.isActive,
    };
  }
} 