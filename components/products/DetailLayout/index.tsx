'use client';

import { useEffect, useRef } from 'react';
import styles from './detailLayout.module.scss';
import { useScrollStore } from '@/store/scrollStore';

interface IProps {
  children: React.ReactNode;
}

const DetailLayout = ({ children }: IProps) => {
  const { scrollHeight, scrollType, shouldScrollToMove, setScrollToMove } = useScrollStore();

  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layoutRef.current && shouldScrollToMove) {
      const containerTop = layoutRef?.current?.getBoundingClientRect().top;

      layoutRef.current.scrollTo({
        top: (scrollHeight[scrollType] ?? 0) - (containerTop + 40),
        behavior: 'smooth',
      });
      setScrollToMove(false);
    }
  }, [scrollHeight, scrollType, setScrollToMove, shouldScrollToMove]);

  return (
    <div className={styles.product_detail_container} ref={layoutRef}>
      {children}
    </div>
  );
};

export default DetailLayout;
