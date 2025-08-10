import { prisma } from '@/lib/prisma';
import { SocialLoginRepository } from '@/backend/auth/domains/repositories/SocialLoginRepository';
import { UserAuth, User } from '@/backend/auth/domains/entities/SocialLogin';

export class PrSocialLoginRepository implements SocialLoginRepository {
  async findByProviderAndProviderId(provider: string, providerId: string): Promise<UserAuth | null> {
    const userAuth = await prisma.userAuth.findFirst({
      where: {
        provider,
        providerId,
      },
    });

    if (!userAuth) return null;

    return {
      id: userAuth.id,
      provider: userAuth.provider,
      providerId: userAuth.providerId,
      passwordHash: userAuth.passwordHash,
      userId: userAuth.userId,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      profileImage: user.profileImage || undefined,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      profileImage: user.profileImage || undefined,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async createUser(userData: {
    email: string;
    name: string;
    nickname: string;
    password: string;
    profileImage?: string;
  }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        nickname: userData.nickname,
        password: userData.password,
        profileImage: userData.profileImage,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      profileImage: user.profileImage || undefined,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async createUserAuth(authData: {
    provider: string;
    providerId: string;
    userId: string;
    passwordHash: string;
  }): Promise<UserAuth> {
    const userAuth = await prisma.userAuth.create({
      data: {
        provider: authData.provider,
        providerId: authData.providerId,
        userId: authData.userId,
        passwordHash: authData.passwordHash,
      },
    });

    return {
      id: userAuth.id,
      provider: userAuth.provider,
      providerId: userAuth.providerId,
      passwordHash: userAuth.passwordHash,
      userId: userAuth.userId,
    };
  }
  
}
