'use client';

import React from 'react';
import styles from './tagButton.module.scss';

interface IProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function TagButton({ children, isActive = false, onClick, className = '', disabled = false }: IProps) {
  return (
    <button
      className={`${styles.tag_button} ${isActive ? styles.active : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
