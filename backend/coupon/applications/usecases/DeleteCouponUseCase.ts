import { CouponRepository } from '../../domains/repositories/CouponRepository';

export class DeleteCouponUseCase {
  private repository: CouponRepository;

  constructor(repository: CouponRepository) {
    this.repository = repository;
  }

  async delete(userId: string, id: number): Promise<number> {
    const result = await this.repository.deleteById(userId, id);

    return result;
  }
}
