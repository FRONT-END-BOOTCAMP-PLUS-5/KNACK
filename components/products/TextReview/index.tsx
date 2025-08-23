import Text from '@/components/common/Text';
import styles from './textReview.module.scss';
import Flex from '@/components/common/Flex';
import Button from '@/components/common/Button';
import { REVIEW_QUESTIONS, DEFAULT_CATEGORY_ID } from '@/utils/review';
import ReviewBottomSheet from '../ReviewBottomSheet';

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
    category: { id: number };
  };
}

const TextReview = ({ productData }: IProps) => {
  // 리뷰가 없어도 UI는 표시하되, 내용만 다르게
  const hasReviews = productData._count.reviews && productData._count.reviews > 0;

  // 별점 분포 데이터 생성 (5점부터 1점까지)
  const ratingProgressData = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    percent: productData.ratingDistribution?.[rating]?.percent || 0,
    count: productData.ratingDistribution?.[rating]?.count || 0
  }));

  // 카테고리별 질문지 정보 가져오기
  const categoryId = productData.category.id;
  const categoryQuestions = REVIEW_QUESTIONS[categoryId] || REVIEW_QUESTIONS[DEFAULT_CATEGORY_ID];
  
  // 질문지 답변 데이터 생성 (카테고리별로 맞춤)
  const questionAnswerData = categoryQuestions.map(question => {
    const answers = productData.questionAnswers?.[question.question];
    if (!answers) {
      return {
        question: question.question,
        answer: '데이터 없음',
        percent: 0
      };
    }
    
    // 최고 퍼센트 답변 찾기
    const maxPercent = Math.max(...Object.values(answers).map((stat: any) => stat.percent));
    const topAnswer = Object.entries(answers).find(([_, stats]) => stats.percent === maxPercent);
    
    return {
      question: question.question,
      answer: topAnswer ? topAnswer[0] : '데이터 없음',
      percent: maxPercent
    };
  });

  return (
    <section className={styles.review_container}>
      <Text tag="h2" size={1.7} weight={600} paddingTop={24} paddingBottom={16}>
        일반 리뷰 {productData._count.reviews || 0}
      </Text>
      
      {hasReviews ? (
        // 리뷰가 있을 때
        <>
          <Flex gap={32}>
            <Text size={4} weight={700}>
              {productData.averageRating || 0}
              <Text tag="span">★</Text>
            </Text>
            <Flex direction="column">
              {ratingProgressData.map((item) => (
                <Flex align="center" gap={8} key={item.rating} marginVertical={4}>
                  <div className={styles.review_progress_bar}>
                    <div className={styles.progress} style={{ width: `${item.percent}%` }} />
                  </div>

                  <Text className={styles.progress_rating} size={1.1} color="gray5">
                    {item.rating}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
          <Flex direction="column" className={styles.review_result_text_wrap}>
          {questionAnswerData.map((item, index) => (
              <Flex gap={8} key={index} paddingVertical={6}>
                <Text tag="p" className={styles.result_title} size={1.5}>
                  {item.answer}
                </Text>
                <Text size={1.5} weight={600}>
                  {item.percent}%
                </Text>
              </Flex>
            ))}
          </Flex>
        </>
            ) : (
        // 리뷰가 없을 때
        <Flex direction="column" gap={16} style={{ padding: '20px 0' }}>
          <Text size={1.4} color="gray5" textAlign="center">
            등록된 리뷰가 없습니다.
          </Text>
        </Flex>
      )}
      
      {/* ReviewBottomSheet 컴포넌트 사용 */}
      <ReviewBottomSheet productData={productData} />
    </section>
  );
};

export default TextReview;
