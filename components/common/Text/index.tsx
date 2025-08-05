'use client';

const TEXT_COLOR = {
  black1: '#222222',
  gray1: '#909090',
  gray2: '#222222CC',
};

interface IProps {
  children?: React.ReactNode;
  tag?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'pre' | 'div';
  size?: number;
  color?: keyof typeof TEXT_COLOR;
  weight?: 400 | 500 | 600 | 700;
}

const Text = ({ children, tag = 'p', size = 1.4, color = 'black1', weight = 400 }: IProps) => {
  const Tag = tag;

  return <Tag style={{ fontSize: size + 'rem', color: TEXT_COLOR[color], fontWeight: weight }}>{children}</Tag>;
};

export default Text;
