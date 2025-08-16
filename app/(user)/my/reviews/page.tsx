'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactStars from 'react-stars';
import styles from './reviews.module.scss';

// 실제 데이터 타입 정의
interface Review {
  userId: string;
  productId: number;
  contents: string;
  rating: number;
  reviewImages?: string;
  createdAt: Date;
}

interface ReviewableOrder {
  order: {
    id: number;
    userId: string;
    productId: number;
    price: number;
    salePrice: number;
    tracking?: string;
    createdAt: Date;
    deliveryStatus: number;
    count: number;
    paymentId?: number;
  };
  product: {
    id: number;
    thumbnailImage: string;
    engName: string;
    korName: string;
    size?: string;
    brand?: {
      engName: string;
      korName: string;
    };
  };
  hasReview: boolean;
  review?: Review;
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'write' | 'my'>('write');
  const [reviewableOrders, setReviewableOrders] = useState<ReviewableOrder[]>([]);
  const [myReviews, setMyReviews] = useState<ReviewableOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reviews/orders');
        const data = await response.json();
        
        if (data.success) {
          setReviewableOrders(data.data.reviewableOrders || []);
          setMyReviews(data.data.myReviews || []);
        } else {
          setError(data.error || '데이터를 가져올 수 없습니다.');
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setError('데이터를 가져올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRatingChange = (productId: number, newRating: number) => {
    // 리뷰 작성 가능한 주문에서 별점 변경
    setReviewableOrders(prev => 
      prev.map(order => 
        order.product.id === productId 
          ? { ...order, rating: newRating }
          : order
      )
    );
  };

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
              <span>리뷰 작성하고 최대 500P 적립 받으세요.</span>
              <span className={styles.arrow}>→</span>
            </div>
            
            {/* 상품 목록 */}
            {loading ? (
              <div className={styles.loading}>데이터를 불러오는 중...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : reviewableOrders.length === 0 ? (
              <div className={styles.empty_message}>리뷰 작성 가능한 주문이 없습니다.</div>
            ) : (
              <div className={styles.product_list}>
                {reviewableOrders.map((order) => (
                  <Link 
                    key={order.order.id} 
                    href={`/my/reviews/${order.product.id}`}
                    className={styles.product_link}
                  >
                    <div className={styles.product_item}>
                      <div className={styles.product_image}>
                        <Image 
                          src={order.product.thumbnailImage} 
                          alt={order.product.korName}
                          width={80}
                          height={80}
                          className={styles.image}
                        />
                      </div>
                      <div className={styles.product_info}>
                        <h3 className={styles.product_eng_name}>{order.product.korName}</h3>
                        <p className={styles.product_kor_name}>{order.product.engName}</p>
                        <p className={styles.product_size}>{order.product.size || '사이즈 정보 없음'}</p>
                      </div>
                    </div>
                    <div className={styles.rating_section}>
                      <ReactStars
                        count={5}
                        value={order.review?.rating || 0}
                        onChange={(newRating: number) => handleRatingChange(order.product.id, newRating)}
                        size={40}
                        color1="#ddd"
                        color2="#ddd"
                        edit={true}
                      />
                      <p className={styles.rating_text}>
                        {order.hasReview ? '이미 리뷰를 작성했습니다.' : '별점을 선택하세요.'}
                      </p>
                    </div>
                  </Link>
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
            ) : myReviews.length === 0 ? (
              <p className={styles.empty_message}>아직 내 리뷰가 없어요</p>
            ) : (
              <div className={styles.product_list}>
                {myReviews.map((order) => (
                  <div key={order.order.id} className={styles.product_link}>
                    <div className={styles.product_item}>
                      <div className={styles.product_image}>
                        <Image 
                          src={order.product.thumbnailImage} 
                          alt={order.product.korName}
                          width={80}
                          height={80}
                          className={styles.image}
                        />
                      </div>
                      <div className={styles.product_info}>
                        <h3 className={styles.product_eng_name}>{order.product.korName}</h3>
                        <p className={styles.product_kor_name}>{order.product.engName}</p>
                        <p className={styles.product_size}>{order.product.size || '사이즈 정보 없음'}</p>
                      </div>
                    </div>
                    <div className={styles.rating_section}>
                      <ReactStars
                        count={5}
                        value={order.review?.rating || 0}
                        size={40}
                        color1="#ddd"
                        color2="#ddd"
                        edit={false}
                      />
                      <p className={styles.rating_text}>리뷰 작성 완료</p>
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