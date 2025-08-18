import { IBrandList, IBrandWithTagList } from '@/types/brand';
import { BrandRepository } from '../../domains/repositories/BrandRepository';
import { BrandRequestDto, BrandWithTagListDto } from '../dtos/BrandDto';

export class GetBrandUseCase {
  private repository: BrandRepository;

  constructor(repository: BrandRepository) {
    this.repository = repository;
  }

  async execute(requestDto: BrandRequestDto): Promise<BrandWithTagListDto[]> {
    try {
      const result = await this.repository.getBrands(requestDto);
      const sorted = [...result].sort((a, b) => {
        const getPriority = (name: string) => {
          if (name.startsWith('&')) return 0;
          if (/^[A-Za-z]/.test(name)) return 1;
          return 2;
        };

        const priA = getPriority(a.engName);
        const priB = getPriority(b.engName);

        if (priA !== priB) return priA - priB;
        return a.engName.localeCompare(b.engName);
      });

      const grouped: Record<string, IBrandList[]> = {};
      sorted.forEach((brand) => {
        const firstChar = brand.engName.charAt(0).toUpperCase();
        if (!grouped[firstChar]) {
          grouped[firstChar] = [];
        }
        grouped[firstChar].push(brand);
      });

      const finalList: IBrandWithTagList[] = Object.entries(grouped).map(([tag, brandList]) => ({
        tag,
        brandList,
      }));

      return finalList;
    } catch {
      throw new Error('error');
    }
  }
}
