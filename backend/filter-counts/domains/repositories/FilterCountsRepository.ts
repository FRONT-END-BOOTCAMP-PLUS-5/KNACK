import { ProductFilters } from '@/backend/search/domains/entities/ProductFilters';

export interface FilterCountsRepository {
  getPrivateProductCount(filters?: ProductFilters): Promise<number>;
}
