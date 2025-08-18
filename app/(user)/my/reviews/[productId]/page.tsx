'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ReactStars from 'react-stars';
import styles from './reviewWrite.module.scss';
import { useSession } from 'next-auth/react';

// 카테고리별 질문과 답변 옵션 (ID 기반)
const reviewQuestions = {
  // ID 1: 상의 (top)
  1: [
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
  // ID 2: 아우터 (outer)
  2: [
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
  ],
  // ID 3: 하의 (bottom)
  3: [
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
  ]
};

export default function ReviewWritePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const productId = params.productId as string;
  
  // URL에서 orderId 가져오기
  const orderId = searchParams.get('orderId');
  
  // 상품 정보 상태
  const [productInfo, setProductInfo] = useState<{
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
  } | null>(null);
  
  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        // TODO: 실제 API 호출로 상품 정보 가져오기
        // 임시로 하드코딩된 데이터 사용
        setProductInfo({
          id: parseInt(productId),
          name: '상품명',
          categoryId: 2, // 기본값: 아우터
          categoryName: '아우터'
        });
      } catch (error) {
        console.error('상품 정보 조회 실패:', error);
      }
    };
    
    fetchProductInfo();
  }, [productId]);
  
  // 카테고리 ID에 따른 질문지 선택
  const getQuestionsByCategoryId = (categoryId: number) => {
    return reviewQuestions[categoryId as keyof typeof reviewQuestions] || reviewQuestions[2]; // 기본값: 아우터
  };
  
  const questions = productInfo ? getQuestionsByCategoryId(productInfo.categoryId) : reviewQuestions[2];
  
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

  const handleSubmit = async () => {
    try {
      // 세션 확인
      if (!session?.user?.id) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 모든 질문에 답변했는지 확인
      if (Object.keys(answers).length < questions.length) {
        alert('모든 질문에 답변해주세요.');
        return;
      }

      // 별점이 선택되었는지 확인
      if (rating === 0) {
        alert('별점을 선택해주세요.');
        return;
      }

      // 리뷰 데이터 준비
      const reviewData = {
        userId: session.user.id, // 세션에서 실제 사용자 ID 가져오기
        productId: parseInt(productId),
        orderId: parseInt(orderId || '0'), // orderId 추가!
        contents: JSON.stringify(answers),
        rating: Math.round(rating), // 소수점 제거하고 정수로 변환
        reviewImages: '' // TODO: 이미지 업로드 기능 추가 시 구현
      };

      console.log('🔍 리뷰 데이터:', reviewData);

      // API 호출하여 리뷰 생성
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (result.success) {
        alert('리뷰가 성공적으로 작성되었습니다!');
        
        // 내 리뷰 탭으로 이동 (orderId도 함께 전달)
        router.push(`/my/reviews?tab=my&oid=${orderId}`);
      } else {
        alert(`리뷰 작성 실패: ${result.error}`);
      }
      
    } catch (error) {
      console.error('리뷰 제출 실패:', error);
      alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
    }
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
