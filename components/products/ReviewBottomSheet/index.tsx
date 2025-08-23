'use client';

import Button from '@/components/common/Button';
import { useState } from 'react';
import styles from './reviewBottomSheet.module.scss';
import { RatingProgressData } from '@/utils/review/ratingUtils';

interface IProps {
  productData: {
    _count: { reviews: number };
    averageRating?: number;
    ratingDistribution?: { [key: number]: { count: number; percent: number } };
    questionAnswers?: {
      [question: string]: {
        [answer: string]: {
          count: number;
          percent: number;
        };
      };
    };
  };
  ratingProgressData: RatingProgressData[];
}

const ReviewBottomSheet = ({ productData, ratingProgressData }: IProps) => {
  const [isReviewSheetOpen, setIsReviewSheetOpen] = useState(false);
  
  // hasReviews를 더 명확하게 정의
  const hasReviews = Boolean(productData._count.reviews && productData._count.reviews > 0);
  
  const openReviewSheet = () => setIsReviewSheetOpen(true);
  const closeReviewSheet = () => setIsReviewSheetOpen(false);
  
  return (
    <>
      <Button 
        text="리뷰 더보기"
        size="large"
        style="border"
        onClick={openReviewSheet}
      />
      
      {/* 바텀시트 */}
      {isReviewSheetOpen && (
        <div className={styles.overlay} onClick={closeReviewSheet}>
          <div className={styles.bottom_sheet} onClick={(e) => e.stopPropagation()}>
            
            {/* 헤더 */}
            <div className={styles.review_header}>
              <h3 className={styles.title}>
                리뷰 더보기
              </h3>
              <button className={styles.close_button} onClick={closeReviewSheet}>
                <img src="/icons/close.svg" alt="닫기" />
              </button>
            </div>
            
            {/* 별점 분포 표시 */}
            {hasReviews ? (
              <div className={styles.rating_container}>
                <div className={styles.rating_summary}>
                  <div className={styles.average_rating}>
                    {productData.averageRating && productData.averageRating > 0 ? productData.averageRating : ''}
                    {productData.averageRating && productData.averageRating > 0 && <span className={styles.star_icon}>★</span>}
                  </div>
                  <div className={styles.review_count}>
                    리뷰 {productData._count.reviews}
                  </div>
                </div>
                <div className={styles.rating_distribution}>
                  {ratingProgressData.map((item) => (
                    <div className={styles.rating_item} key={item.rating}>
                      <div className={styles.progress_container}>
                        <div 
                          className={styles.progress_bar} 
                          style={{ width: `${item.percent}%` }} 
                        />
                      </div>
                      <span className={styles.rating_number}>
                        {item.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.no_reviews}>
                <div className={styles.no_reviews_text}>
                  아직 리뷰가 없어요
                </div>
                <div className={styles.no_reviews_subtext}>
                  첫 번째 리뷰를 작성해보세요!
                </div>
              </div>
            )}
            
            {/* allQuestionAnswers 데이터를 바텀시트에 표시 */}
            {hasReviews && productData.questionAnswers && (
              <div className={styles.question_results}>
                {Object.entries(productData.questionAnswers).map(([question, answers]) => {
                  // 각 질문에서 가장 높은 퍼센트 찾기
                  const maxPercent = Math.max(...Object.values(answers).map((stat: any) => stat.percent));
                  
                  return (
                    <div key={question} className={styles.question_block}>
                      <h4 className={styles.question_title}>
                        {question}
                      </h4>
                      
                      {Object.entries(answers).map(([answer, stats]) => {
                        // 최고 퍼센트인지 확인
                        const isHighest = stats.percent === maxPercent;
                        
                        return (
                          <div className={styles.answer_item} key={answer}>
                            <span className={`${styles.answer_text} ${isHighest ? styles.highest_percent : ''}`}>
                              {answer}
                            </span>
                            <div className={styles.answer_stats}>
                              <span className={styles.answer_count}>
                                {stats.count}명
                              </span>
                              <span className={styles.answer_percent}>
                                {stats.percent}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewBottomSheet;
