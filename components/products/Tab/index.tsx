'use client';

import { useState } from 'react';
import styles from './tab.module.scss';
import { ScrollHeight, useScrollStore } from '@/store/scrollStore';

interface TabType {
  id: number;
  name: string;
  scrollType: keyof ScrollHeight;
}

const TABS: TabType[] = [
  { id: 0, name: '상세정보', scrollType: 'detailImage' },
  { id: 1, name: '리뷰', scrollType: 'review' },
  { id: 2, name: '추천', scrollType: 'recommend' },
];

const Tab = () => {
  const [select, setSelect] = useState(0);
  const { setScrollToMove, setScrollType } = useScrollStore();

  const handleScrollToMove = (id: number) => {
    setScrollType(TABS[id].scrollType);
    setScrollToMove(true);
    setSelect(id);
  };

  return (
    <div className={styles.position}>
      <article className={styles.tab_wrap}>
        {TABS?.map((item) => (
          <button
            key={item?.id}
            className={`${styles.tab_button} ${select === item?.id && styles.active}`}
            onClick={() => handleScrollToMove(item?.id)}
          >
            {item?.name}
          </button>
        ))}
      </article>
      <div className={styles.active_border} style={{ left: select * 25 + '%' }} />
    </div>
  );
};

export default Tab;
