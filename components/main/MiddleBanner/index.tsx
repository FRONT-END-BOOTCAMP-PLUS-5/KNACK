'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './middleBanner.module.scss';
import Image from 'next/image';

import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import { MIDDLE_BANNER_SLIDE } from '@/constraint/main';

const MiddleBanner = () => {
  return (
    <div className={styles.middle_banner_container}>
      <Swiper
        slidesPerView={'auto'}
        centeredSlides={true}
        spaceBetween={15}
        className="mySwiper"
        autoplay={{ delay: 1000 }}
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
    </div>
  );
};

export default MiddleBanner;
