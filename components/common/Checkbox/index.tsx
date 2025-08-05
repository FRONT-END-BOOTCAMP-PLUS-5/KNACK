'use client';

import { useState } from 'react';
import styles from './checkbox.module.scss';

interface IProps {
  id?: string;
  checked?: boolean | null;
  onChangeCheckbox?: (checked: boolean) => void;
}

const Checkbox = ({ id, checked, onChangeCheckbox }: IProps) => {
  const [check, setCheck] = useState(false);

  return (
    <input
      className={styles.checkbox_style}
      id={id}
      type="checkbox"
      checked={checked ? checked : check}
      onChange={(e) => {
        onChangeCheckbox?.(e.target.checked);
        setCheck(e.target.checked);
      }}
    />
  );
};

export default Checkbox;
