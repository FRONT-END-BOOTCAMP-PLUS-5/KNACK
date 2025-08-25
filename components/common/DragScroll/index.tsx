'use client';

import React from 'react';
import styles from './dragScroll.module.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css';

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export default function DragScroll({ children, className = '' }: IProps) {
  return (
    <ScrollContainer className={`scroll-container ${styles.drag_scroll} ${className}`} horizontal>
      {children}
    </ScrollContainer>
  );
}
