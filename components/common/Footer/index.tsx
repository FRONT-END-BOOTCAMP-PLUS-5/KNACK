'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './footer.module.scss';
import { DEFAULT_ACTIVE_TAB } from '@/constraint/footer';
import { getFooterTabs } from '@/utils/footer/index';
import { TabId } from '@/types/footer';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = useMemo(() => {
    switch (pathname) {
      case '/':
        return 'HOME';
      case '/search':
        return 'SHOP';
      case '/saved':
        return 'SAVED';
      case '/my':
        return 'MY';
      default:
        return DEFAULT_ACTIVE_TAB;
    }
  }, [pathname]);

  const handleTabClick = (tab: TabId) => {
    // 페이지 이동
    switch (tab) {
      case 'HOME':
        router.push('/');
        break;
      case 'SHOP':
        router.push('/search');
        break;
      case 'SAVED':
        router.push('/saved');
        break;
      case 'MY':
        router.push('/my');
        break;
      default:
        break;
    }
  };

  const tabs = getFooterTabs();

  return (
    <footer className={styles.footer}>
      <nav className={styles['footer-nav']}>
        <ul className={styles['nav-list']}>
          {tabs.map((tab) => (
            <li key={tab.id} className={styles['nav-item']}>
              <button
                className={`${styles['nav-button']} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <div className={styles['icon-container']}>
                  {activeTab === tab.id ? tab.activeIcon : tab.defaultIcon}
                </div>
                <span className={styles['nav-label']}>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
