'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './header.module.scss';
import { HEADER_TABS, DEFAULT_ACTIVE_TAB, HeaderTab } from '@/constraint/header';
import { useRouter } from 'next/navigation';
import { IProps } from '@/types/header';
import Image from 'next/image';
import BellIcon from '@/public/icons/bell.svg';
import CartIcon from '@/public/icons/cart.svg';
import HomeIcon from '@/public/icons/home.svg';

export default function Header({
  hideHeaderElements = false,
  showBackButton = false,
  pageTitle,
  showLogo = true,
  hideActionButtons = false,
  showHomeButton = false,
}: IProps) {
  // 현재 활성화된 탭 상태 관리
  const [activeTab, setActiveTab] = useState<HeaderTab>(DEFAULT_ACTIVE_TAB);

  // Next.js 라우터 (뒤로가기 기능용)
  const router = useRouter();

  const handleTabClick = (tab: HeaderTab) => {
    setActiveTab(tab);
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

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        {/* 로고 또는 뒤로가기 버튼 */}
        {showLogo ? (
          <Link href="/" className={styles.logo}>
            <h1>KNACK</h1>
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
            <svg className={styles.search_icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="브랜드, 상품, 태그 등" className={styles.search_input} />
          </div>
        ) : pageTitle ? (
          <h2 className={styles.page_title}>{pageTitle}</h2>
        ) : null}

        {/* 액션 버튼들 (알림, 장바구니) */}
        {/* hideActionButtons이 true면 숨김 (프로필, 주문내역 등) */}
        {!hideActionButtons && (
          <div className={styles.header_actions}>
            <button className={styles.icon_button}>
              <Image src={BellIcon} width={24} height={24} alt="알림" />
            </button>

            <button className={styles.icon_button} onClick={handleCartClick}>
              <Image src={CartIcon} width={24} height={24} alt="장바구니" />
            </button>
          </div>
        )}

        {/* 홈 버튼: showHomeButton이 true일 때만 표시 (독립적으로 동작) */}
        {showHomeButton && (
          <div className={styles.header_actions}>
            <button className={styles.icon_button} onClick={handleCartMain}>
              <Image src={HomeIcon} width={24} height={24} alt="홈" />
            </button>
          </div>
        )}
      </div>

      {/* 탭 네비게이션 */}
      {!hideHeaderElements && (
        <nav className={styles.tab_navigation} aria-label="카테고리 탭">
          <ul className={styles.tab_list}>
            {HEADER_TABS.map((tab) => (
              <li key={tab} className={styles.tab_item}>
                <button
                  className={`${styles.tab_button} ${activeTab === tab ? styles.active : ''}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
