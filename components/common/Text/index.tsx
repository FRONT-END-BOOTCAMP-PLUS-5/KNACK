'use client';

const TEXT_COLOR = {
  black1: '#222',
  gray1: '#222222cc',
  gray2: '#22222280',
  gray3: '#333',
  gray4: '#4e4e4e',
  gray5: '#00000057',
  gray6: '#22222266',
  lightGray1: '#a7a7a7',
  lightGray2: '#f4f4f4',
  white: '#fff',
  red1: '#ef6253',
  red2: '#ff4757',
  green1: '#41b979',
};

interface IProps {
  children?: React.ReactNode;
  tag?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'pre' | 'div';
  size?: number;
  color?: keyof typeof TEXT_COLOR;
  weight?: 400 | 500 | 600 | 700;
  lineHeight?: string;
  className?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  textAlign?: 'left' | 'center' | 'right';
}

const Text = ({
  children,
  tag = 'p',
  size = 1.4,
  color = 'black1',
  weight = 400,
  className,
  lineHeight = 'normal',
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  paddingRight = 0,
  textAlign = 'left',
}: IProps) => {
  const Tag = tag;

  return (
    <Tag
      className={className}
      style={{
        fontSize: size + 'rem',
        color: TEXT_COLOR[color],
        fontWeight: weight,
        marginTop: marginTop,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
        marginRight: marginRight,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        lineHeight: lineHeight,
        textAlign: textAlign,
      }}
    >
      {children}
    </Tag>
  );
};

export default Text;
