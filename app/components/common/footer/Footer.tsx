'use client';

import { useState } from 'react';
import styles from '@/app/components/common/footer/footer.module.scss';
import { DEFAULT_ACTIVE_TAB } from '@/constraint/footer';
import { getFooterTabs } from '@/utils/footer/index';
import { TabId } from '@/types/footer';

export default function Footer() {
  const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_ACTIVE_TAB);

  const handleTabClick = (tab: TabId) => {
    setActiveTab(tab);
    // 페이지 이동 대신 현재는 탭 상태만 변경
    console.log(`${tab} 탭 클릭됨`);
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