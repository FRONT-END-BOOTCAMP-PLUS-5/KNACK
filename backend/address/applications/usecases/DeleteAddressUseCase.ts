import { AddressRepository } from '../../domains/repositories/AddressRepository';

export class DeleteAddressUseCase {
  constructor(private readonly repo: AddressRepository) {}

  async execute(id: number, userId: string): Promise<{ id: number; code: string }> {
    const existing = await this.repo.getById(id);

    if (!existing) {
      throw new Error('주소를 찾을 수 없습니다.');
    }

    if (existing.userId !== userId) {
      throw new Error('해당 주소를 삭제할 권한이 없습니다.');
    }

    const result = await this.repo.delete(id);

    return { ...result };
  }
}
