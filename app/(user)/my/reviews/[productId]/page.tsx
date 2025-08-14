'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import ReactStars from 'react-stars';
import styles from './reviewWrite.module.scss';

// 카테고리별 질문과 답변 옵션
const reviewQuestions = {
  shoes: [
    {
      question: '구매하신 신발 사이즈는 어떤가요?',
      options: ['작게 나왔어요', '정사이즈예요', '크게 나왔어요']
    },
    {
      question: '평소 사이즈에서 얼마나 크게/작게 구매했나요?',
      options: ['한사이즈 다운', '반사이즈 다운', '정사이즈', '반사이즈 업', '한사이즈 업']
    },
    {
      question: '착화감은 어떤가요?',
      options: ['불편해요', '보통이에요', '편해요']
    },
    {
      question: '구매한 신발의 발볼은 어떤가요?',
      options: ['좁아요', '보통이에요', '넓어요']
    }
  ],
  top: [
    {
      question: '구매하신 상의 사이즈는 어떤가요?',
      options: ['오버핏이에요', '정사이즈예요', '슬림핏이에요']
    },
    {
      question: '두께감은 어떤가요?',
      options: ['두께감이 보통이에요', '두께감이 두꺼워요', '두께감이 얇아요']
    },
    {
      question: '퀄리티는 어떤가요?',
      options: ['퀄리티가 만족스러워요', '퀄리티가 매우 만족스러워요', '퀄리티가 보통이에요']
    }
  ],
  bottom: [
    {
      question: '구매하신 하의 사이즈는 어떤가요?',
      options: ['작게 나왔어요', '정사이즈예요', '크게 나왔어요']
    },
    {
      question: '하의 길이는 어떤가요?',
      options: ['짧아요', '적당해요', '길어요']
    },
    {
      question: '하의 퀄리티는 어떤가요?',
      options: ['퀄리티가 별로예요', '퀄리티가 보통이에요', '퀄리티가 만족스러워요', '퀄리티가 매우 만족스러워요']
    }
  ],
  outer: [
    {
      question: '구매하신 아우터 사이즈는 어떤가요?',
      options: ['작게 나왔어요', '정사이즈예요', '크게 나왔어요']
    },
    {
      question: '아우터 길이는 어떤가요?',
      options: ['짧아요', '적당해요', '길어요']
    },
    {
      question: '착용감은 어떤가요?',
      options: ['불편해요', '보통이에요', '편해요']
    },
    {
      question: '보온성은 어떤가요?',
      options: ['보온성이 부족해요', '보온성이 보통이에요', '보온성이 만족스러워요', '보온성이 매우 만족스러워요']
    }
  ]
};

export default function ReviewWritePage() {
  const params = useParams();
  const productId = params.productId as string;
  
  // 상품 카테고리 추정 (URL에서)
  const getCategoryFromId = (id: string) => {
    if (id.includes('shoes') || id.includes('신발')) return 'shoes';
    if (id.includes('top') || id.includes('상의')) return 'top';
    if (id.includes('bottom') || id.includes('하의')) return 'bottom';
    if (id.includes('outer') || id.includes('아우터')) return 'outer';
    return 'outer'; // 기본값
  };
  
  const category = getCategoryFromId(productId);
  const questions = reviewQuestions[category as keyof typeof reviewQuestions] || reviewQuestions.shoes;
  
  // 답변 상태 관리
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [rating, setRating] = useState(5);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    console.log('별점:', rating);
    console.log('리뷰 답변:', answers);
    // TODO: API 호출 로직 추가
  };

  return (
    <main>

      <div className={styles.review_form}>
        {/* 별점 평가 섹션 */}
        <div className={styles.question_section}>
          <h3 className={styles.question}>상품은 마음에 드셨나요?</h3>
          <div>
            <ReactStars
              count={5}
              value={rating}
              onChange={handleRatingChange}
              size={40}
              color1="#ddd"
              color2="#222"
              edit={true}
            />
          </div>
        </div>

        {/* 카테고리별 질문들 */}
        {questions.map((question, index) => (
          <div key={index} className={styles.question_section}>
            <h3 className={styles.question}>{question.question}</h3>
            <div className={styles.options}>
              {question.options.map((option) => (
                <label key={option} className={styles.option}>
                  <input
                    type="radio"
                    name={question.question}
                    value={option}
                    checked={answers[question.question] === option}
                    onChange={() => handleAnswerChange(question.question, option)}
                  />
                  <span className={styles.option_text}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.submit_section}>
        <button 
          className={styles.submit_button}
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
        >
          리뷰 작성 완료
        </button>
      </div>
    </main>
  );
}
