'use client';

import styles from './checkbox.module.scss';

interface IProps {
  id?: string;
  checked?: boolean;
  onChangeCheckbox?: (checked: boolean) => void;
}

const Checkbox = ({ id, checked, onChangeCheckbox }: IProps) => {
  return (
    <input
      className={styles.checkbox_style}
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChangeCheckbox?.(e.target.checked)}
    />
  );
};

export default Checkbox;
