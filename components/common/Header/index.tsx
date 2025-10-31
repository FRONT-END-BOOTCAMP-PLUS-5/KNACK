'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './header.module.scss';
import { HEADER_TABS, HeaderTab } from '@/constraint/header';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IProps } from '@/types/header';
import Image from 'next/image';
import HamburgerIcon from '@/public/icons/hamburger.svg';
import CartIcon from '@/public/icons/cart.svg';
import HomeIcon from '@/public/icons/home.svg';
import { useCartStore } from '@/store/cartStore';
import HeaderCategory from './HeaderCategory';
import HeaderInput from '../HeaderInput';
import SearchModal from '../SearchModal';
import CategoryBrandModal from '../CategoryBrandModal';
import Logo from '@/public/images/logo_white.png';
import { useCart } from '@/hooks/cart/useCart';

export default function Header({
  hideHeaderElements = false,
  showBackButton = false,
  pageTitle,
  showLogo = true,
  hideActionButtons = false,
  showHomeButton = false,
  hideHamburgerOnly = false,
}: IProps) {
  // 현재 활성화된 탭 상태 관리
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCategoryBrandModalOpen, setIsCategoryBrandModalOpen] = useState(false);

  const { carts } = useCart();

  const { storeCarts, setStoreCarts, clearStoreCarts } = useCartStore();

  // Next.js 라우터 (뒤로가기 기능용)
  const router = useRouter();

  const activeTab = useMemo(() => {
    return HEADER_TABS.find((tab) => tab?.url === pathname);
  }, [pathname]);

  const handleTabClick = (tab: HeaderTab) => {
    router.push(tab?.url);
  };

  const handleCartClick = () => {
    window.location.href = '/cart';
  };

  const handleCartMain = () => {
    window.location.href = '/';
  };

  const handleBackClick = () => {
    router.back();
  };

  useEffect(() => {
    if (carts?.length === 0) return;

    clearStoreCarts();
    carts?.forEach((item) => {
      setStoreCarts(item);
    });
  }, [carts, clearStoreCarts, setStoreCarts]);

  useEffect(() => {
    setIsSearchModalOpen(false);
    setIsCategoryBrandModalOpen(false);
  }, [pathname, searchParams]);

  const handleSearchInputClick = (state: boolean) => {
    setIsSearchModalOpen(state);
  };

  const handleCategoryBrandModalOpen = (state: boolean) => {
    setIsCategoryBrandModalOpen(state);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        {/* 로고 또는 뒤로가기 버튼 */}
        {showLogo ? (
          <Link href="/" className={styles.logo}>
            <Image src={Logo} alt="KNACK Logo" width={72} height={27} />
          </Link>
        ) : showBackButton ? (
          <button className={styles.back_button} onClick={handleBackClick}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10.75 3.5 2.265 11.985 10.75 20.471" />
              <path d="M3 12h19" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
        {/* 검색창 또는 페이지 제목 */}
        {!hideHeaderElements ? (
          <div className={styles.search_container}>
            <HeaderInput handleSearchInputClick={handleSearchInputClick} />
          </div>
        ) : pageTitle ? (
          <h2 className={styles.page_title}>{pageTitle}</h2>
        ) : null}

        {/* 액션 버튼들 (카테고리&브랜드 모달, 장바구니, 홈) */}
        {/* hideActionButtons이 true면 숨김 (프로필, 주문내역 등) */}
        {!hideActionButtons && (
          <div className={styles.header_actions}>
            {/* /products/에서만 햄버거 메뉴 숨김 */}
            {!hideHamburgerOnly && (
              <button className={styles.icon_button} onClick={() => setIsCategoryBrandModalOpen(true)}>
                <Image src={HamburgerIcon} width={24} height={24} alt="카테고리 & 브랜드 모달" />
              </button>
            )}

            <button className={styles.icon_button} onClick={handleCartClick}>
              <Image src={CartIcon} width={24} height={24} alt="장바구니" />
              <span className={styles.cart_count}>{storeCarts?.length}</span>
            </button>
          </div>
        )}

        {/* 홈 버튼: showHomeButton이 true일 때만 표시 (hideActionButtons와 관계없이) */}
        {showHomeButton && (
          <button className={styles.icon_button} onClick={handleCartMain}>
            <Image src={HomeIcon} width={24} height={24} alt="홈" />
          </button>
        )}
      </div>

      {/* 탭 네비게이션 */}
      {!hideHeaderElements && pathname === '/search' && <HeaderCategory />}
      {!hideHeaderElements && pathname !== '/search' && (
        <nav className={styles.tab_navigation} aria-label="카테고리 탭">
          <ul className={styles.tab_list}>
            {HEADER_TABS.map((tab) => (
              <li key={'header_navigation_' + tab?.id} className={styles.tab_item}>
                <button
                  className={`${styles.tab_button} ${activeTab?.id === tab?.id ? styles.active : ''}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab?.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* 검색모달 */}
      {isSearchModalOpen && <SearchModal handleSearchInputClick={handleSearchInputClick} />}

      {/* 카테고리&브랜드모달 */}
      {isCategoryBrandModalOpen && (
        <CategoryBrandModal
          handleCategoryBrandModalOpen={handleCategoryBrandModalOpen}
          handleCartClick={handleCartClick}
        />
      )}
    </header>
  );
}
