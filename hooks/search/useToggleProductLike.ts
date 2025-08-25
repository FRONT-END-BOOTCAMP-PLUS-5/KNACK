import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeService } from '@/services/like';
import { ISearchProductList, ISearchProductListResponse } from '@/types/searchProductList';

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
      await queryClient.cancelQueries({ queryKey: ['searchProductList'] });

      const queries = queryClient.getQueriesData<IInfiniteScrollProductList>({
        queryKey: ['searchProductList'],
      });
      queries.forEach(([key, prev]) => {
        if (!prev) return;

        queryClient.setQueryData<IInfiniteScrollProductList>(key, {
          ...prev,
          pages: prev.pages.map((page: ISearchProductListResponse) => ({
            ...page,
            products: page.products.map((product: ISearchProductList) =>
              product.id === id
                ? {
                    ...product,
                    isLiked: !isLiked,
                    likesCount: isLiked ? product.likesCount - 1 : product.likesCount + 1,
                  }
                : product
            ),
          })),
        });
      });

      return { previousQueries: queries };
    },

    onError: (err, _, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('상품 좋아요 처리 실패:', err);
    },
  });
};
