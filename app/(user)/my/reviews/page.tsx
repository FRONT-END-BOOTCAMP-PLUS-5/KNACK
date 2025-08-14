'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactStars from 'react-stars';
import styles from './reviews.module.scss';

// 더미 데이터
const dummyProducts = [
  {
    id: 1,
    image: '/images/product1.jpg', // 실제 이미지 경로로 변경 필요
    engName: 'Vans Vault x Brain Dead OG Authentic LX...',
    korName: '반스 볼트 x 브레인 데드 OG 어센틱 LX 블랙 화이트',
    size: '285',
    rating: 0
  },
  {
    id: 2,
    image: '/images/product2.jpg',
    engName: 'On Running Cloudmonster Cinder Fog',
    korName: '온 러닝 클라우드몬스터 신더 포그',
    size: 'EU 44.5',
    rating: 0
  },
  {
    id: 3,
    image: '/images/product3.jpg',
    engName: 'Supreme x Martine Rose Down Puffer Jac...',
    korName: '슈프림 x 마틴 로즈 다운 푸퍼 자켓 블랙 - 24FW',
    size: 'XL',
    rating: 0
  }
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'write' | 'my'>('write');
  const [products, setProducts] = useState(dummyProducts);

  const handleRatingChange = (productId: number, newRating: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, rating: newRating }
          : product
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
          리뷰 쓰기 {products.length}
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
            <div className={styles.product_list}>
              {products.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/my/reviews/${product.id}`}
                  className={styles.product_link}
                >
                  <div className={styles.product_item}>
                    <div className={styles.product_image}>
                      <Image 
                        src={product.image} 
                        alt={product.korName}
                        width={80}
                        height={80}
                        className={styles.image}
                      />
                    </div>
                    <div className={styles.product_info}>
                      <h3 className={styles.product_eng_name}>{product.engName}</h3>
                      <p className={styles.product_kor_name}>{product.korName}</p>
                      <p className={styles.product_size}>{product.size}</p>
                    </div>
                  </div>
                  <div className={styles.rating_section}>
                    <ReactStars
                      count={5}
                      value={product.rating}
                      onChange={(newRating: number) => handleRatingChange(product.id, newRating)}
                      size={40}
                      color1="#ddd"
                      color2="#ddd"
                      edit={true}
                    />
                    <p className={styles.rating_text}>별점을 선택하세요.</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.my_content}>
            <p className={styles.empty_message}>아직 내 리뷰가 없어요</p>
          </div>
        )}
      </div>
    </main>
  );
}