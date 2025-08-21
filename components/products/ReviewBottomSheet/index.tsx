'use client';

import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import Button from '@/components/common/Button';
import { useState } from 'react';
import styles from './reviewBottomSheet.module.scss';

interface IProps {
  productData: {
    _count: { reviews: number };
    averageRating?: number;
    ratingDistribution?: { [key: number]: { count: number; percent: number } };
    allQuestionAnswers?: {
      [question: string]: {
        [answer: string]: {
          count: number;
          percent: number;
        };
      };
    };
  };
}

const ReviewBottomSheet = ({ productData }: IProps) => {
  const [isReviewSheetOpen, setIsReviewSheetOpen] = useState(false);
  
  const openReviewSheet = () => setIsReviewSheetOpen(true);
  const closeReviewSheet = () => setIsReviewSheetOpen(false);
  
  const hasReviews = productData._count.reviews && productData._count.reviews > 0;

  // 별점 분포 데이터 생성 (5점부터 1점까지)
  const ratingProgressData = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    percent: productData.ratingDistribution?.[rating]?.percent || 0,
    count: productData.ratingDistribution?.[rating]?.count || 0
  }));

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
            
            {/* 핸들바 */}
            <div className={styles.handle} />
            
            <Text tag="h3" className={styles.title}>
              리뷰 상세 정보
            </Text>
            
            {/* 별점 분포 표시 */}
            {hasReviews && (
              <div className={styles.rating_container}>
                <Text tag="h4" className={styles.section_title}>
                  별점 분포
                </Text>
                <Flex className={styles.rating_distribution}>
                  <Text className={styles.average_rating}>
                    {productData.averageRating || 0}
                    <Text tag="span" className={styles.star_icon}>★</Text>
                  </Text>
                  <Flex className={styles.rating_list}>
                    {ratingProgressData.map((item) => (
                      <Flex className={styles.rating_item} key={item.rating}>
                        <div className={styles.progress_container}>
                          <div 
                            className={styles.progress_bar} 
                            style={{ width: `${item.percent}%` }} 
                          />
                        </div>
                        <Text className={styles.rating_number}>
                          {item.rating}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              </div>
            )}
            
            {/* allQuestionAnswers 데이터를 바텀시트에 표시 */}
            {hasReviews && productData.allQuestionAnswers && (
              <div className={styles.question_results}>
                <Text tag="h4" className={styles.section_title}>
                  설문지 결과 상세
                </Text>
                {Object.entries(productData.allQuestionAnswers).map(([question, answers]) => (
                  <div key={question}>
                    <Text tag="h5" className={styles.question_title}>
                      {question}
                    </Text>
                    
                    {Object.entries(answers).map(([answer, stats]) => (
                      <Flex className={styles.answer_item} key={answer}>
                        <Text className={styles.answer_text}>{answer}</Text>
                        <Flex className={styles.answer_stats}>
                          <Text className={styles.answer_count}>
                            {stats.count}명
                          </Text>
                          <Text className={styles.answer_percent}>
                            {stats.percent}%
                          </Text>
                        </Flex>
                      </Flex>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewBottomSheet;
