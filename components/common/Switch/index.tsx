'use client';

import styles from './switch.module.scss';

interface IProps {
  isActive: boolean;
  onActive: () => void;
}

const Switch = ({ isActive, onActive }: IProps) => {
  return (
    <button className={`${styles.switch_wrap} ${isActive ? styles.active : styles.normal}`} onClick={onActive}>
      <div className={`${styles.circle} ${isActive ? styles.active : styles.normal}`} />
    </button>
  );
};

export default Switch;
