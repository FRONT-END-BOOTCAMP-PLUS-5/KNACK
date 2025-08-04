'use client';

import styles from './chipButton.module.scss';

interface IProps {
  text?: string;
  onClick?: () => void;
  minWidth?: number;
  minHeight?: number;
}

const ChipButton = ({ text, minWidth = 64, minHeight = 24, onClick }: IProps) => {
  return (
    <div className={styles.chip_button_style}>
      <button
        className={styles.chip_button}
        style={{ minWidth: minWidth + 'px', minHeight: minHeight + 'px' }}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default ChipButton;
