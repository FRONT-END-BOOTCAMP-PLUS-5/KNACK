import { useQuery } from '@tanstack/react-query';
import { likeService } from '@/services/like';

export const useBrandLike = () => {
  const { getBrandLikes } = likeService;

  return useQuery({
    queryKey: ['brandLikeModal'],
    queryFn: () => getBrandLikes(),
    staleTime: 0,
    gcTime: 0,
  });
};
