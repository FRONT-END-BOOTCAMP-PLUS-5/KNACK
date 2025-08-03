'use client';

import styles from './button.module.scss';

interface IProps {
  text: string;
  style?: 'border' | 'black' | 'orange';
  size?: 'medium' | 'large';
  onClick?: () => void;
}

const Button = ({ text, style = 'border', size = 'medium', onClick }: IProps) => {
  return (
    <button className={`${styles.button_style} ${styles[style]} ${styles[size]}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
