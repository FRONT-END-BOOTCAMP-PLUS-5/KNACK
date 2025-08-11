'use client';

import styles from './button.module.scss';

interface IProps {
  text?: string;
  style?: 'border' | 'black' | 'orange';
  size?: 'medium' | 'large' | 'self';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button = ({ text, children, style = 'border', size = 'medium', className, onClick }: IProps) => {
  return (
    <button className={`${className} ${styles.button_style} ${styles[style]} ${styles[size]}`} onClick={onClick}>
      {text}
      {children}
    </button>
  );
};

export default Button;
