import { ReviewQuestions } from '@/types/review';

// 카테고리별 질문과 답변 옵션 (ID 기반)
export const REVIEW_QUESTIONS: ReviewQuestions = {
  1: [
    {
      question: '구매하신 상의 사이즈는 어떤가요?',
      options: ['오버핏이에요', '정사이즈예요', '슬림핏이에요'],
    },
    {
      question: '두께감은 어떤가요?',
      options: ['두께감이 보통이에요', '두께감이 두꺼워요', '두께감이 얇아요'],
    },
    {
      question: '퀄리티는 어떤가요?',
      options: ['퀄리티가 만족스러워요', '퀄리티가 매우 만족스러워요', '퀄리티가 보통이에요'],
    },
  ],
  2: [
    {
      question: '구매하신 아우터 사이즈는 어떤가요?',
      options: ['작게 나왔어요', '정사이즈예요', '크게 나왔어요'],
    },
    {
      question: '아우터 길이는 어떤가요?',
      options: ['짧아요', '적당해요', '길어요'],
    },
    {
      question: '착용감은 어떤가요?',
      options: ['불편해요', '보통이에요', '편해요'],
    },
    {
      question: '보온성은 어떤가요?',
      options: ['보온성이 부족해요', '보온성이 보통이에요', '보온성이 만족스러워요', '보온성이 매우 만족스러워요'],
    },
  ],
  3: [
    {
      question: '구매하신 하의 사이즈는 어떤가요?',
      options: ['작게 나왔어요', '정사이즈예요', '크게 나왔어요'],
    },
    {
      question: '하의 길이는 어떤가요?',
      options: ['짧아요', '적당해요', '길어요'],
    },
    {
      question: '하의 퀄리티는 어떤가요?',
      options: ['퀄리티가 별로예요', '퀄리티가 보통이에요', '퀄리티가 만족스러워요', '퀄리티가 매우 만족스러워요'],
    },
  ],
  4: [
    {
      question: '구매하신 가방 사이즈는 어떤가요?',
      options: ['작게 나왔어요', '정사이즈예요', '크게 나왔어요'],
    },
    {
      question: '무게감은 어떤가요?',
      options: ['무게감이 가벼워요', '무게감이 보통이에요', '무게감이 무거워요'],
    },
    {
      question: '가방 퀄리티는 어떤가요?',
      options: ['퀄리티가 별로예요', '퀄리티가 보통이에요', '퀄리티가 만족스러워요', '퀄리티가 매우 만족스러워요'],
    },
  ],
  5: [
    {
      question: '구매하신 신발 사이즈는 어떤가요?',
      options: ['작게 나왔어요', '정사이즈예요', '크게 나왔어요'],
    },
    {
      question: '착화감은 어떤가요?',
      options: ['불편해요', '보통이에요', '편해요'],
    },
    {
      question: '신발 퀄리티는 어떤가요?',
      options: ['퀄리티가 별로예요', '퀄리티가 보통이에요', '퀄리티가 만족스러워요', '퀄리티가 매우 만족스러워요'],
    },
  ],
};

// 기본 카테고리 ID (아우터)
export const DEFAULT_CATEGORY_ID = 2;

// 리뷰 작성 인센티브 메시지
export const REVIEW_INCENTIVE_MESSAGE = '리뷰 작성하고 최대 500P 적립 받으세요.';

// 에러 메시지
export const ERROR_MESSAGES = {
  FETCH_FAILED: '데이터를 가져올 수 없습니다.',
  NO_REVIEWABLE_ORDERS: '리뷰 작성 가능한 주문이 없습니다.',
  NO_MY_REVIEWS: '아직 내 리뷰가 없어요',
} as const;
