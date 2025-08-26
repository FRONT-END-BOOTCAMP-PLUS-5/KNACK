import { useQuery } from '@tanstack/react-query';
import { likeService } from '@/services/like';
import { useUserStore } from '@/store/userStore';

export const useBrandLike = () => {
  const { user } = useUserStore();
  const { getBrandLikes } = likeService;

  return useQuery({
    queryKey: ['brandLikeModal'],
    queryFn: () => getBrandLikes(),
    enabled: !!user?.id,
    staleTime: 0,
    gcTime: 0,
  });
};
