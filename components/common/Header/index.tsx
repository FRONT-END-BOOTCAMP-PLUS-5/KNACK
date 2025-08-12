'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './header.module.scss';
import { HEADER_TABS, DEFAULT_ACTIVE_TAB, HeaderTab } from '@/constraint/header';

export default function Header() {
  const [activeTab, setActiveTab] = useState<HeaderTab>(DEFAULT_ACTIVE_TAB);
  const { data: session } = useSession();

  const handleTabClick = (tab: HeaderTab) => {
    setActiveTab(tab);
  };

  const handleCartClick = () => {
    // 미들웨어에서 이미 로그인 체크하므로 바로 장바구니로 이동
    window.location.href = '/cart';
  };

  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <Link href="/" className={styles.logo}>
          <h1>KNACK</h1>
        </Link>
        
        <div className={styles['search-container']}>
          <svg className={styles['search-icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="브랜드, 상품, 태그 등"
            className={styles['search-input']}
          />
        </div>
        
        <div className={styles['header-actions']}>
          <button className={styles['icon-button']}>
            <svg className={styles['bell-icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <span className={styles['notification-dot']}></span>
          </button>
          <button className={styles['icon-button']} onClick={handleCartClick}>
            <svg className={styles['bag-icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* 탭 네비게이션 */}
      <nav className={styles['tab-navigation']} aria-label="카테고리 탭">
        <ul className={styles['tab-list']}>
          {HEADER_TABS.map((tab) => (
            <li key={tab} className={styles['tab-item']}>
              <button
                className={`${styles['tab-button']} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
} 