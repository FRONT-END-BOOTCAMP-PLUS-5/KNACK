import { brandService } from '@/services/brand';
import { useQuery } from '@tanstack/react-query';

export const useBrandList = () => {
  const { getBrands } = brandService;
  return useQuery({
    queryKey: ['brandList'],
    queryFn: () => getBrands(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
