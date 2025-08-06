'use client';

import styles from './flex.module.scss';

interface IProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'column';
  align?: 'center' | 'start';
  justify?: 'between' | 'center' | 'start';
  width?: 'full' | 'self';
  gap?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
}

const Flex = ({
  children,
  className,
  direction = 'row',
  align = 'start',
  justify = 'start',
  width = 'full',
  gap = 0,
  paddingVertical = 0,
  paddingHorizontal = 0,
}: IProps) => {
  return (
    <div
      className={`${className} ${styles.flex_style} ${styles['align_' + align]} ${styles['justify_' + justify]} ${
        styles['width_' + width]
      }`}
      style={{ padding: `${paddingVertical}px ${paddingHorizontal}px`, flexDirection: direction, gap: gap + 'px' }}
    >
      {children}
    </div>
  );
};

export default Flex;
