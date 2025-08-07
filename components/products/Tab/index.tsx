'use client';

import { useState } from 'react';
import styles from './tab.module.scss';

const TABS = [
  { id: 0, name: '상세정보' },
  { id: 1, name: '리뷰' },
  { id: 2, name: '추천' },
];

const Tab = () => {
  const [select, setSelect] = useState(0);

  return (
    <div className={styles.position}>
      <article className={styles.tab_wrap}>
        {TABS?.map((item) => (
          <button
            key={item?.id}
            className={`${styles.tab_button} ${select === item?.id && styles.active}`}
            onClick={() => setSelect(item?.id)}
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
