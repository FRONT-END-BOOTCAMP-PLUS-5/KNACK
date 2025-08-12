import { UpdateUser } from '../../domains/entities/User';
import { UserRepository } from '../../domains/repositories/UserRepository';

export class UpdateUserUseCase {
  private repository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async update(id: string): Promise<UpdateUser> {
    const result = await this.repository.updateUser(id);

    return {
      email: result.email,
      id: result.id,
      name: result.name,
      profileImage: result.profileImage,
      marketing: result.marketing,
      sns: result.sns,
    };
  }
}
