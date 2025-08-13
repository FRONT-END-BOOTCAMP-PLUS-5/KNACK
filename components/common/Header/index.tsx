'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './header.module.scss';
import { HEADER_TABS, DEFAULT_ACTIVE_TAB, HeaderTab } from '@/constraint/header';
import { useRouter } from 'next/navigation';
import { IProps } from '@/types/header';

export default function Header({ 
  hideHeaderElements = false, 
  showBackButton = false, 
  pageTitle, 
  showLogo = true,
  hideActionButtons = false,
  showHomeButton = false
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
              <svg className={styles.bell_icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className={styles.notification_dot}></span>
            </button>
            
            <button className={styles.icon_button} onClick={handleCartClick}>
              <svg className={styles.bag_icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
            </button>
          </div>
        )}

        {/* 홈 버튼: showHomeButton이 true일 때만 표시 (독립적으로 동작) */}
        {showHomeButton && (
          <div className={styles.header_actions}>
            <button className={styles.icon_button} onClick={handleCartMain}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
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
