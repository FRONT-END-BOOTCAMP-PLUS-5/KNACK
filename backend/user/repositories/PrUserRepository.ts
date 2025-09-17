import { prisma } from '@/lib/prisma';
import { UpdateUser } from '../domains/entities/User';
import { UserRepository } from '../domains/repositories/UserRepository';

interface IProps {
  profileImage: string;
  name: string;
  nickname: string;
  sns: boolean;
  marketing: boolean;
  point: number;
}

export class PrUserRepository implements UserRepository {
  private userData;

  constructor(userData?: IProps) {
    this.userData = userData;
  }

  async updateUser(id: string): Promise<UpdateUser> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        profileImage: this.userData?.profileImage,
        nickname: this.userData?.nickname,
        name: this.userData?.name,
        marketing: this.userData?.marketing,
        sns: this.userData?.sns,
        point: this.userData?.point,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        sns: true,
        marketing: true,
        point: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage ?? '',
      sns: true,
      marketing: true,
      point: user?.point,
    };
  }
}
