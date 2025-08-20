'use client';

import styles from './flex.module.scss';

interface IProps {
  tag?: 'div' | 'ul' | 'li' | 'nav' | 'article' | 'main' | 'section' | 'aside' | 'details';
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'column';
  align?: 'center' | 'start' | 'end';
  justify?: 'between' | 'center' | 'start';
  width?: 'full' | 'self';
  gap?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  style?: React.CSSProperties;
}

const Flex = ({
  tag = 'div',
  children,
  className = '',
  direction = 'row',
  align = 'start',
  justify = 'start',
  width = 'full',
  gap = 0,
  paddingVertical = 0,
  paddingHorizontal = 0,
  marginVertical = 0,
  marginHorizontal = 0,
  style,
}: IProps) => {
  const Tag = tag;

  return (
    <Tag
      className={`${className} ${styles.flex_style} ${styles['align_' + align]} ${styles['justify_' + justify]} ${
        styles['width_' + width]
      }`}
      style={{
        padding: `${paddingVertical}px ${paddingHorizontal}px`,
        flexDirection: direction,
        gap: gap + 'px',
        margin: `${marginVertical}px ${marginHorizontal}px`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
};

export default Flex;
