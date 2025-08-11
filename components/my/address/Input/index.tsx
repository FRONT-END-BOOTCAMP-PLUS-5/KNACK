import styles from './Input.module.scss';

interface IProps {
  label: string;
  labelId: string;
  placeholder?: string;
  value?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

const Input = ({ label, labelId, value, placeholder, error, onClear, onChange }: IProps) => {
  return (
    <div className={styles.input_group}>
      <label htmlFor={labelId}>{label}</label>
      <div className={styles.input_wrapper}>
        <input
          id={labelId}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={error ? styles.input_error : ''}
        />
        {value && onClear && (
          <button type="button" onClick={onClear} className={styles.clear_button}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
