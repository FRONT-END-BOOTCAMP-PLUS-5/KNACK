import { ProductFilters, SortOption, PaginationParams, ProductListResponse } from '../entities/ProductFilters';

export interface ProductSearchRepository {
  getProducts(params: {
    userId?: string;
    filters?: ProductFilters;
    sort?: SortOption;
    pagination?: PaginationParams;
  }): Promise<ProductListResponse>;
}
