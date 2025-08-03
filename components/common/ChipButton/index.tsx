'use client';

import styles from './chipButton.module.scss';

interface IProps {
  text?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
}

const ChipButton = ({ text, width = 64, height = 24, onClick }: IProps) => {
  return (
    <div className={styles.chip_button_style}>
      <button className={styles.chip_button} style={{ width: width + 'px', height: height + 'px' }} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default ChipButton;
