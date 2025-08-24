import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeService } from '@/services/like';
import { IBrandWithTagList } from '@/types/brand';
import { IBrandLikeList } from '@/types/like';

interface IProps {
  isLiked: boolean;
  id: number;
}

interface IBrandLikeListData {
  result: IBrandLikeList[];
  status: number;
}

export const useBrandAddLike = () => {
  const queryClient = useQueryClient();

  const { addBrandLike, deleteBrandLike } = likeService;

  return useMutation({
    mutationFn: async ({ isLiked, id }: IProps) => {
      if (isLiked) {
        return await deleteBrandLike(id);
      } else {
        return await addBrandLike(id);
      }
    },
    onMutate: async ({ isLiked, id }) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: ['brandListModal'] });
      await queryClient.cancelQueries({ queryKey: ['brandLikeModal'] });

      // 이전 데이터 백업
      const previousBrandList = queryClient.getQueryData<IBrandWithTagList[]>(['brandListModal']);
      const previousBrandLikes = queryClient.getQueryData(['brandLikeModal']);

      // 낙관적 업데이트
      queryClient.setQueryData<IBrandWithTagList[]>(['brandListModal'], (prev) => {
        if (!prev) return prev;
        return prev.map((brandGroup) => ({
          ...brandGroup,
          brandList: brandGroup.brandList.map((brand) =>
            brand.id === id
              ? {
                  ...brand,
                  isLiked: !isLiked,
                  likesCount: isLiked ? brand.likesCount - 1 : brand.likesCount + 1,
                }
              : brand
          ),
        }));
      });

      if (isLiked) {
        // 좋아요 삭제
        queryClient.setQueryData(['brandLikeModal'], (prev: IBrandLikeListData) => {
          if (!prev) return prev;
          return {
            ...prev,
            result: prev.result.filter((item: IBrandLikeList) => item.brand?.id !== id),
          };
        });
      }

      return { previousBrandList, previousBrandLikes };
    },
    onError: (err, _, context) => {
      if (context?.previousBrandList) {
        queryClient.setQueryData(['brandListModal'], context.previousBrandList);
      }
      if (context?.previousBrandLikes) {
        queryClient.setQueryData(['brandLikeModal'], context.previousBrandLikes);
      }
      console.error('브랜드 좋아요 처리 실패:', err);
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['brandListModal'] });
        queryClient.invalidateQueries({ queryKey: ['brandLikeModal'] });
      }, 1000);
    },
  });
};
