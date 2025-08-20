'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ReactStars from 'react-stars';
import styles from './reviewWrite.module.scss';
import { useUserStore } from '@/store/userStore';
import Toast from '@/components/common/Toast';

import { REVIEW_QUESTIONS, DEFAULT_CATEGORY_ID } from '@/utils/review';
import { reviewService } from '@/services/review';

export default function ReviewWritePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  
  const orderId = params.orderId as string;
  
  // URL에서 productId 가져오기
  const productId = searchParams.get('productId');
  
  // 상품 정보 상태
  const [productInfo, setProductInfo] = useState<{
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
  } | null>(null);
  
  // 답변 상태 관리
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [rating, setRating] = useState(5);
  
  // 토스트 상태 관리
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });

  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProductInfo = async () => {
      if (!productId) return;
        try {
          // reviewService를 사용하여 상품 정보 가져오기
          const data = await reviewService.getProduct(productId);
          
          if (data.status === 200 && data.result) {
            setProductInfo({
              id: parseInt(productId),
              name: data.result.korName,
              categoryId: data.result.category.id,
              categoryName: data.result.category.korName
            });
          }
        } catch (error) {
          console.error('상품 정보 조회 실패:', error);
        }
    };
    
    fetchProductInfo();
  }, [productId]);
  
  // 카테고리 ID에 따른 질문지 선택
  const getQuestionsByCategoryId = (categoryId: number) => {
    const result = REVIEW_QUESTIONS[categoryId] || REVIEW_QUESTIONS[DEFAULT_CATEGORY_ID];
    return result;
  };
  
  const questions = productInfo ? getQuestionsByCategoryId(productInfo.categoryId) : REVIEW_QUESTIONS[DEFAULT_CATEGORY_ID];

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleRatingChange = (newRating: number) => {
    // 소수점을 정수로 변환하여 저장
    const roundedRating = Math.round(newRating);
    setRating(roundedRating);
  };

  // 토스트 표시 함수
  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 1500);
  };

  const handleSubmit = async () => {
    try {
      // 필수 파라미터 검증
      if (!productId || !orderId) {
        showToast('error', '상품 정보 또는 주문 정보를 찾을 수 없습니다.');
        return;
      }

      // 리뷰 데이터 준비 (전역에서 이미 세션 보호됨)
      const reviewData = {
        userId: user!.id,
        productId: parseInt(productId),
        orderId: parseInt(orderId),
        contents: JSON.stringify(answers),
        rating: Math.round(rating),
        reviewImages: ''
      };

      // reviewService를 사용하여 리뷰 생성
      const result = await reviewService.createReview(reviewData);

      if (result.success) {
        showToast('success', '리뷰가 성공적으로 작성되었습니다!');
        // 토스트가 끝난 후 페이지 이동
        setTimeout(() => {
          router.push(`/my/review?tab=my&oid=${orderId}`);
        }, 1500);
      } else {
        showToast('error', `리뷰 작성 실패: ${result.error}`);
      }
      
    } catch (error) {
      console.error('리뷰 제출 실패:', error);
      showToast('error', '리뷰 제출에 실패했습니다. 다시 시도해주세요.');
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
              half={false}
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

      {/* 토스트 팝업 */}
      {toast.show && (
        <Toast type={toast.type}>
          {toast.message}
        </Toast>
      )}
    </main>
  );
}
