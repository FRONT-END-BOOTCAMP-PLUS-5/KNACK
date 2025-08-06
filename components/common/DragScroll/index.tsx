'use client';

import React from 'react';
import styles from './drag_scroll.module.scss';

interface IProps {
  children: React.ReactNode;
  className?: string;
  showScrollbar?: boolean;
}

export default function DragScroll({ children, className = '', showScrollbar = false }: IProps) {
  const scrollbarClass = showScrollbar ? styles.show_scrollbar : styles.hide_scrollbar;

  return <div className={`${styles.drag_scroll} ${scrollbarClass} ${className}`}>{children}</div>;
}
