'use client';

import { usePathname } from 'next/navigation';
import styles from './header.module.scss';

export default function Header() {
  const pathname = usePathname();
  
  // 헤더를 숨길 페이지들
  const hideHeaderPaths = ['/login', '/signup', '/auth'];
  
  // 현재 경로가 헤더를 숨겨야 하는 경로인지 확인
  const shouldHideHeader = hideHeaderPaths.some(path => pathname.startsWith(path));
  
  if (shouldHideHeader) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <div className={styles.logo}>
          <h1>KNACK</h1>
        </div>
        
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
          <button className={styles['icon-button']}>
            <svg className={styles['bag-icon']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 