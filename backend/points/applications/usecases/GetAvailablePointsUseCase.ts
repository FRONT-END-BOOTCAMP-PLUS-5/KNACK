// backend/points/applications/usecases/GetAvailablePointsUseCase.ts
import { PointsDto } from '@/backend/points/applications/dtos/PointsDto';
import { UserPointsRepository } from '@/backend/points/domains/repositories/UserPointsRepository';

export class GetAvailablePointsUseCase {
  constructor(private readonly repo: UserPointsRepository) { }

  async execute(userId: string): Promise<PointsDto> {
    const availablePoints = await this.repo.getAvailablePoints(userId);
    return { availablePoints };
  }
}
