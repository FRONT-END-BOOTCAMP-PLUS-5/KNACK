'use client';
import Portal from '../Portal';
import styles from './categoryBrandModal.module.scss';
import Image from 'next/image';
import arrowLeft from '@/public/icons/arrow_left.svg';
import CartIcon from '@/public/icons/cart.svg';
import { useCartStore } from '@/store/cartStore';
import { categoryService } from '@/services/category';
import { useCallback, useEffect, useState } from 'react';
import { IPageCategory } from '@/types/category';
import CategoryTab from './CategoryTab';
import BrandTab from './BrandTab';
import Kakao from '@/public/images/kakao.jpg';
import Text from '../Text';

interface IProps {
  handleCategoryBrandModalOpen: (state: boolean) => void;
  handleCartClick: () => void;
}

export default function CategoryBrandModal({ handleCategoryBrandModalOpen, handleCartClick }: IProps) {
  const [categoryList, setCategoryList] = useState<IPageCategory[]>([]);
  const [activeTab, setActiveTab] = useState<'category' | 'brand'>('category');
  const { storeCarts } = useCartStore();
  const { getCategories } = categoryService;

  const initCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      setCategoryList(res);
    } catch (error) {
      console.error('카테고리 데이터 호출 실패 : ', error);
    }
  }, [getCategories]);

  useEffect(() => {
    initCategories();
  }, [initCategories]);

  return (
    <Portal>
      <article className={styles.search_container}>
        <section className={styles.header_container}>
          <div className={styles.header_wrapper}>
            <Image src={arrowLeft} alt="arrow_left" onClick={() => handleCategoryBrandModalOpen(false)} />
            <nav className={styles.nav_container}>
              <p
                onClick={() => setActiveTab('category')}
                className={`${styles.nav_item} ${activeTab === 'category' ? styles.active : ''}`}
              >
                카테고리
              </p>
              <span className={styles.nav_separator} />
              <p
                onClick={() => setActiveTab('brand')}
                className={`${styles.nav_item} ${activeTab === 'brand' ? styles.active : ''}`}
              >
                브랜드
              </p>
            </nav>
            <button className={styles.icon_button} onClick={handleCartClick}>
              <Image src={CartIcon} width={24} height={24} alt="장바구니" />
              <span className={styles.cart_count}>{storeCarts?.length}</span>
            </button>
          </div>
          {activeTab === 'category' && (
            <div className={styles.kakao_banner_container}>
              <div className={styles.kakao_banner_wrapper}>
                <div>
                  <Text color="black1" size={1.6} weight={700}>
                    최대 3만원 즉시할인
                  </Text>
                  <Text color="gray5" size={1.3}>
                    카카오페이 머니 결제 시
                  </Text>
                </div>
                <Image src={Kakao} width={250} height={100} alt="카카오 페이 배너" />
              </div>
            </div>
          )}
        </section>
        {activeTab === 'category' && (
          <CategoryTab categoryList={categoryList} handleCategoryBrandModalOpen={handleCategoryBrandModalOpen} />
        )}
        {activeTab === 'brand' && <BrandTab />}
      </article>
    </Portal>
  );
}
