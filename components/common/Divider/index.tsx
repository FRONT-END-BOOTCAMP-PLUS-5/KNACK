'use client';

import styles from './divider.module.scss';

interface IProps {
  height?: number;
  paddingHorizontal?: number;
}

const Divider = ({ height = 8, paddingHorizontal = 0 }: IProps) => {
  return (
    <div className={styles.divider_style} style={{ height: height + 'px', padding: `0 ${paddingHorizontal}px` }}>
      <div className={styles.divider_item} />
    </div>
  );
};

export default Divider;
