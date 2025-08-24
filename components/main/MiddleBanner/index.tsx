'use client';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import styles from './middleBanner.module.scss';
import Image from 'next/image';

import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import { MIDDLE_BANNER_SLIDE } from '@/constraint/main';
import { useState } from 'react';

const MiddleBanner = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleSwiper = (value: SwiperClass) => {
    setActiveIndex(value.activeIndex + 1);
  };

  return (
    <div className={styles.middle_banner_container}>
      <Swiper
        slidesPerView={'auto'}
        centeredSlides={true}
        spaceBetween={15}
        className="mySwiper"
        autoplay={{ delay: 1000 }}
        onActiveIndexChange={(index) => handleSwiper(index)}
      >
        {MIDDLE_BANNER_SLIDE?.map((item, index) => (
          <SwiperSlide className={styles.swiper_slide} key={'middle_banner_' + index}>
            <Flex className={styles.banner_text} direction="column" align="start" justify="center">
              <Text size={1.6} weight={600} marginBottom={4}>
                {item?.mainText}
              </Text>
              <Text size={1.4}>{item?.subText}</Text>
            </Flex>
            <div className={styles.image_box}>
              <Image src={item?.src} fill alt={'중간베너' + index} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.swiper_index}>
        {activeIndex} / {MIDDLE_BANNER_SLIDE?.length}
      </div>
    </div>
  );
};

export default MiddleBanner;
