import { brandService } from '@/services/brand';
import { useQuery } from '@tanstack/react-query';

export const useBrandList = () => {
  const { getBrands } = brandService;
  return useQuery({
    queryKey: ['brandListModal'],
    queryFn: () => getBrands(),
    staleTime: 0,
    gcTime: 0,
  });
};
