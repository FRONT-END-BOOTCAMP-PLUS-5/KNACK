import { useUserStore } from '@/store/userStore';

/**
 * 리뷰 작성 후 리뷰 수를 실시간으로 업데이트하는 함수
 * @param newReviewCount 새로운 리뷰 수
 */
export const updateReviewCountAfterAction = (newReviewCount: number) => {
  const { updateReviewCount } = useUserStore.getState();
  updateReviewCount(newReviewCount);
};

/**
 * 리뷰 작성 완료 후 호출되는 함수
 * @param currentCount 현재 리뷰 수
 */
export const handleReviewCreated = (currentCount: number) => {
  // 리뷰 작성 성공 후 리뷰 수를 1 증가
  updateReviewCountAfterAction(currentCount + 1);
};

/**
 * 리뷰 삭제 완료 후 호출되는 함수
 * @param currentCount 현재 리뷰 수
 */
export const handleReviewDeleted = (currentCount: number) => {
  // 리뷰 삭제 성공 후 리뷰 수를 1 감소
  updateReviewCountAfterAction(Math.max(0, currentCount - 1));
};

/**
 * 리뷰 수를 직접 설정하는 함수 (API 응답에서 받은 실제 수치로 업데이트)
 * @param exactCount 정확한 리뷰 수
 */
export const setExactReviewCount = (exactCount: number) => {
  updateReviewCountAfterAction(exactCount);
};
