import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeService } from '@/services/like';
import { ISearchProductListResponse } from '@/types/searchProductList';
import { useSearchParams } from 'next/navigation';

interface IProps {
  isLiked: boolean;
  id: number;
}

interface IInfiniteScrollProductList {
  pages: ISearchProductListResponse[];
  pageParams: (string | undefined)[];
}

export const useToggleProductLike = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { addLike, deleteLike } = likeService;

  return useMutation({
    mutationFn: async ({ isLiked, id }: IProps) => {
      if (isLiked) {
        return await deleteLike(id);
      } else {
        return await addLike(id);
      }
    },
    onMutate: async ({ isLiked, id }) => {
      await queryClient.cancelQueries({
        queryKey: ['searchProductList', searchParams.toString()],
      });

      const previousProductList = queryClient.getQueryData(['searchProductList', searchParams.toString()]);

      queryClient.setQueryData(
        ['searchProductList', searchParams.toString()],
        (prev: IInfiniteScrollProductList | undefined) => {
          if (!prev?.pages) return prev;

          return {
            ...prev,
            pages: prev.pages.map((page: ISearchProductListResponse) => ({
              ...page,
              products: page.products.map((product) =>
                product.id === id
                  ? {
                      ...product,
                      isLiked: !isLiked,
                      likesCount: isLiked ? product.likesCount - 1 : product.likesCount + 1,
                    }
                  : product
              ),
            })),
          };
        }
      );

      return { previousProductList };
    },
    onError: (err, _, context) => {
      if (context?.previousProductList) {
        queryClient.setQueryData(['searchProductList', searchParams.toString()], context.previousProductList);
      }
      console.error('상품 좋아요 처리 실패:', err);
    },
  });
};
