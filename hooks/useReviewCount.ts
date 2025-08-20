import { useUserStore } from '@/store/userStore';

/**
 * 사용자의 리뷰 수를 가져오는 훅
 * LayoutWrapper에서 이미 로드된 reviewCount를 사용하므로 별도 API 호출 불필요
 * 리뷰 작성/삭제 시 updateReviewCount로 실시간 업데이트 가능
 */
export const useReviewCount = () => {
  const { reviewCount } = useUserStore();

  return { reviewCount };
};
