'use client';

import styles from './checkbox.module.scss';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

interface IProps {
  id?: string;
  checked?: boolean;
  onChangeCheckbox?: (checked: boolean) => void;
}

const Checkbox = ({ id, checked, onChangeCheckbox }: IProps) => {
  return (
    <label htmlFor={id} className={`${styles.checkbox_label} ${checked && styles.active}`}>
      <CheckRoundedIcon className={`${styles.check_icon} ${checked && styles.active}`} viewBox="2 2 20 20" />
      <input
        className={styles.checkbox_input}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChangeCheckbox?.(e.target.checked)}
      />
    </label>
  );
};

export default Checkbox;
