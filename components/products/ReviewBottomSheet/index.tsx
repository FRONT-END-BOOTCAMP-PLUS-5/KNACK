'use client';

import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import Button from '@/components/common/Button';
import BottomSheet from '@/components/common/BottomSheet';
import { useState } from 'react';

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
        <BottomSheet>
          <div style={{ padding: '20px' }}>
            <Text tag="h3" size={1.5} weight={600} paddingBottom={16}>
              리뷰 상세 정보
            </Text>
            
            {/* 별점 분포 표시 */}
            {hasReviews && (
              <div style={{ marginBottom: '20px' }}>
                <Text tag="h4" size={1.3} weight={600} paddingBottom={8}>
                  별점 분포
                </Text>
                <Flex gap={32}>
                  <Text size={4} weight={700}>
                    {productData.averageRating || 0}
                    <Text tag="span">★</Text>
                  </Text>
                  <Flex direction="column">
                    {ratingProgressData.map((item) => (
                      <Flex align="center" gap={8} key={item.rating} marginVertical={4}>
                        <div style={{ 
                          width: '100px', 
                          height: '8px', 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${item.percent}%`, 
                            height: '100%', 
                            backgroundColor: '#ffd700' 
                          }} />
                        </div>
                        <Text size={1.1} color="gray5">
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
              <div>
                <Text tag="h4" size={1.3} weight={600} paddingBottom={8}>
                  설문지 결과 상세
                </Text>
                {Object.entries(productData.allQuestionAnswers).map(([question, answers]) => (
                  <div key={question} style={{ marginBottom: '20px' }}>
                    <Text tag="h5" size={1.2} weight={600} paddingBottom={8}>
                      {question}
                    </Text>
                    
                    {Object.entries(answers).map(([answer, stats]) => (
                      <Flex key={answer} justify="between" align="center" paddingVertical={4}>
                        <Text size={1.2}>{answer}</Text>
                        <Flex gap={8}>
                          <Text size={1.2} color="gray5">
                            {stats.count}명
                          </Text>
                          <Text size={1.2} weight={600}>
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
        </BottomSheet>
      )}
    </>
  );
};

export default ReviewBottomSheet;
