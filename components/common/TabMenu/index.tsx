'use client';
import { useEffect, useRef } from 'react';
import DragScroll from '@/components/common/DragScroll';
import styles from './tabMenu.module.scss';

interface ITabItem {
  id: number;
  name: string;
  badge?: number;
}

interface IProps {
  tabs: ITabItem[];
  selectedTab: number;
  onTabSelect: (tabId: number) => void;
  autoScroll?: boolean;
  style?: React.CSSProperties;
}

export default function TabMenu({ tabs, selectedTab, onTabSelect, autoScroll = true, style }: IProps) {
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!autoScroll) return;

    const activeTabIndex = tabs.findIndex((item) => item.id === selectedTab);
    const activeTabRef = tabRefs.current[activeTabIndex];

    if (activeTabRef) {
      activeTabRef.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  }, [selectedTab, tabs, autoScroll]);

  return (
    <section className={styles.tab_menu_container} style={style}>
      <DragScroll className={styles.tab_menu_scroll}>
        <ul className={styles.tab_menu_list}>
          {tabs.map((item, index) => (
            <li
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className={`${styles.tab_menu_item} ${selectedTab === item.id ? styles.active : ''}`}
              key={item.id}
            >
              <button className={styles.tab_menu_button} onClick={() => onTabSelect(item.id)}>
                {item.name}
              </button>
              {item.badge && <span className={styles.tab_menu_badge}>{item.badge}</span>}
              {selectedTab === item.id && <div className={styles.active_border} />}
            </li>
          ))}
        </ul>
      </DragScroll>
    </section>
  );
}
