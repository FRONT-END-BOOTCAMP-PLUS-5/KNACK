'use client';

import styles from './mainBannerContent.module.scss';
import Image from 'next/image';
import Flex from '@/components/common/Flex';
import Text, { TEXT_COLOR } from '@/components/common/Text';

interface IProps {
  src: string;
  mainText: string;
  subText: string;
  alt: string;
  textColor?: keyof typeof TEXT_COLOR;
}

const MainBannerContent = ({ src, mainText, subText, alt, textColor }: IProps) => {
  const imageSize = 0.9019607843137255 * 100 + '%';

  return (
    <>
      <div className={styles.image_box} style={{ paddingTop: imageSize }}>
        <Image src={src} fill alt={alt} />
      </div>
      <Flex className={styles.slide_text_box} direction="column" gap={4}>
        <Text className={styles.banner_main_text} size={2.4} weight={600} lineHeight={'1.2'} color={textColor}>
          {mainText}
        </Text>
        <Text className={styles.banner_sub_text} size={1.3} color={textColor}>
          {subText}
        </Text>
      </Flex>
    </>
  );
};

export default MainBannerContent;
