import { prisma } from '@/lib/prisma';
import { UpdateUser } from '../domains/entities/UpdateUser';
import { UserUpdateRepository } from '../domains/repositories/UserUpdateRepository';

interface IProps {
  updateType: 'profileImage' | 'name' | 'nickname';
  userData: {
    profileImage: string;
    name: string;
    nickname: string;
  };
}

export class PrUserUpdateRepository implements UserUpdateRepository {
  private userData;

  constructor(userData?: IProps) {
    this.userData = userData;
  }

  async updateUser(id: string): Promise<UpdateUser> {
    const data = {
      updateType: this.userData?.userData?.[this?.userData?.updateType],
    };

    const user = await prisma.user.update({
      where: { id },
      data: data,
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage ?? '',
    };
  }
}
