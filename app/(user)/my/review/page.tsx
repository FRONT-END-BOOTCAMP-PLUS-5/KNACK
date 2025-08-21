'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactStars from 'react-stars';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './review.module.scss';

import { ReviewOrderDto, MyReviewDto } from '@/types/review';
import { useReview } from '@/hooks/useReview';
import { REVIEW_INCENTIVE_MESSAGE, ERROR_MESSAGES } from '@/utils/review';

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'write' | 'my'>('write');
  
  // 커스텀 훅 사용
  const { 
    reviewableOrders, 
    myreview, 
    loading, 
    error, 
    fetchReviewData, 
    removeOrderFromReviewable 
  } = useReview();

  // 리뷰 클릭 시 상품 상세페이지로 이동
  const handleReviewClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  // URL 쿼리 파라미터에서 탭 정보 가져오기
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'my') {
      setActiveTab('my');
    }
  }, [searchParams]);

  // API에서 데이터 가져오기
  useEffect(() => {
    fetchReviewData();
  }, []);

  // URL 쿼리 파라미터에서 탭 정보와 orderId 확인 (API 재호출 방지)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const oid = searchParams.get('oid');
    
    if (tabParam === 'my') {
      setActiveTab('my');
      
      // orderId가 있으면 해당 주문을 reviewableOrders에서 제거 (리뷰 작성 완료 후)
      if (oid) {
        removeOrderFromReviewable(parseInt(oid));
      }
    }
  }, [searchParams, removeOrderFromReviewable]);

  return (
    <main>
      {/* 탭 버튼 */}
      <div className={styles.tab_container}>
        <button 
          className={`${styles.tab_button} ${activeTab === 'write' ? styles.active : ''}`}
          onClick={() => setActiveTab('write')}
        >
          리뷰 쓰기 {reviewableOrders.length}
        </button>
        <button 
          className={`${styles.tab_button} ${activeTab === 'my' ? styles.active : ''}`}
          onClick={() => setActiveTab('my')}
        >
          내 리뷰
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className={styles.tab_content}>
        {activeTab === 'write' ? (
          <div className={styles.write_content}>
                         {/* 인센티브 메시지 */}
             <div className={styles.incentive_message}>
               <span>{REVIEW_INCENTIVE_MESSAGE}</span>
               <span className={styles.arrow}>→</span>
             </div>
            
            {/* 상품 목록 */}
            {loading ? (
              <div className={styles.loading}>데이터를 불러오는 중...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
                         ) : reviewableOrders.length === 0 ? (
               <div className={styles.empty_message}>{ERROR_MESSAGES.NO_REVIEWABLE_ORDERS}</div>
             ) : (
              <div className={styles.product_list}>
                {reviewableOrders.map((order: ReviewOrderDto) => (
                  <div 
                    key={`write-${order.orderId}`} 
                    className={styles.product_link}
                  >
                    {/* 상품 정보는 Link로 감싸서 리뷰 작성 페이지로 이동 */}
                    <Link href={`/my/review/${order.orderId}?productId=${order.productId}`}>
                      <div className={styles.product_item}>
                        <div className={styles.product_image}>
                          <Image 
                            src={order.thumbnailImage ? `https://d2ubv3uh3d6fx8.cloudfront.net/uploads/product/thumbnail/${order.thumbnailImage}` : '/images/default-product.jpg'} 
                            alt={order.productName}
                            width={80}
                            height={80}
                            className={styles.image}
                          />
                        </div>
                        <div className={styles.product_info}>
                          <h3 className={styles.product_eng_name}>{order.productName}</h3>
                          <p className={styles.product_kor_name}>{order.productEngName}</p>
                        <p className={styles.product_size}>
                          {order.size || '사이즈 정보 없음'}
                        </p>
                        </div>
                      </div>
                      {/* 별점 입력 */}
                    <div className={styles.rating_section}>
                      <div className={styles.rating_input}>
                        <ReactStars
                          count={5}
                          value={0}
                          size={30}
                          color1="#ddd"
                          color2="#ddd"
                          edit={true}
                          onChange={(rating) => {
                            // 별점 변경 처리
                          }}
                        />
                        <span className={styles.rating_label}>별점을 선택하세요.</span>
                      </div>
                    </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.my_content}>
            {loading ? (
              <div className={styles.loading}>데이터를 불러오는 중...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
                         ) : myreview.length === 0 ? (
               <p className={styles.empty_message}>{ERROR_MESSAGES.NO_MY_REVIEWS}</p>
             ) : (
              <div className={styles.product_list}>
                {myreview.map((order: MyReviewDto) => (
                  <div key={`my-${order.orderId}`} className={styles.product_link} onClick={() => handleReviewClick(order.productId)}>
                    <div className={styles.product_item}>
                      <div className={styles.product_image}>
                        <Image 
                          src={order.thumbnailImage ? `https://d2ubv3uh3d6fx8.cloudfront.net/uploads/product/thumbnail/${order.thumbnailImage}` : '/images/default-product.jpg'} 
                          alt={order.productName}
                          width={80}
                          height={80}
                          className={styles.image}
                        />
                      </div>
                      <div className={styles.product_info}>
                        <h3 className={styles.product_eng_name}>{order.productName}</h3>
                        <p className={styles.product_kor_name}>{order.productEngName}</p>
                        <p className={styles.product_size}>
                          {order.size || '사이즈 정보 없음'}
                        </p>
                      </div>
                    </div>
                    <div className={styles.rating_section}>
                      <ReactStars
                        count={5}
                        value={order.review?.rating || 0}
                        size={40}
                        color1="#ddd"
                        color2="#222"
                        edit={false}
                      />
                      
                      {/* 리뷰 작성 일시 */}
                      <p className={styles.review_date}>
                        {order.review?.createdAt ? new Date(order.review.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : ''}
                      </p>
                      
                      {/* 카테고리별 맞춤형 태그들 */}
                      {order.review?.contents && (
                        <div className={styles.review_tags}>
                          {(() => {
                            try {
                              const answers = JSON.parse(order.review.contents);
                              return Object.entries(answers).map(([question, answer]) => (
                                <span key={question} className={styles.review_tag}>
                                  {answer as string}
                                </span>
                              ));
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}