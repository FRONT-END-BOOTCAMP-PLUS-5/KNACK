import { BrandRequestDto } from '../../applications/dtos/BrandDto';
import { Brand } from '../entities/Brand';

export interface BrandRepository {
  getBrands(requestDto: BrandRequestDto): Promise<Brand[]>;
}
