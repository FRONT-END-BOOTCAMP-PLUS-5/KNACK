'use client';

import styles from './checkbox.module.scss';

interface IProps {
  id?: string;
  onChangeCheckbox?: (checked: boolean) => void;
}

const Checkbox = ({ id, onChangeCheckbox }: IProps) => {
  return (
    <input
      className={styles.checkbox_style}
      id={id}
      type="checkbox"
      onChange={(e) => onChangeCheckbox?.(e.target.checked)}
    />
  );
};

export default Checkbox;
