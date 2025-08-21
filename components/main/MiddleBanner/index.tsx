'use client';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import styles from './middleBanner.module.scss';
import { useState } from 'react';
import Image from 'next/image';

import middleBanner01 from '@/public/images/middle_banner01.jpg';
import middleBanner02 from '@/public/images/middle_banner02.jpg';
import middleBanner03 from '@/public/images/middle_banner03.jpg';
import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';

const IMAGE_SLIDE = [
  {
    src: middleBanner01,
    mainText: '최대 2만5천원 즉시할인',
    subText: '토스페이 x 삼성카드 결제 시',
  },
  {
    src: middleBanner02,
    mainText: '최대 3만원 즉시할인',
    subText: '카카오페이 머니 결제 시',
  },
  {
    src: middleBanner03,
    mainText: 'BC카드 3% 청구할인',
    subText: '20만원 이상 결제 시',
  },
];

const MiddleBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSwiper = (value: SwiperClass) => {
    setActiveIndex(value.activeIndex);
  };

  console.log('IMAGE_SLIDE', IMAGE_SLIDE);

  return (
    <div className={styles.middle_banner_container}>
      <Swiper
        slidesPerView={'auto'}
        centeredSlides={true}
        spaceBetween={15}
        onActiveIndexChange={(index) => handleSwiper(index)}
        className="mySwiper"
        autoplay={{ delay: 1000 }}
      >
        {IMAGE_SLIDE?.map((item, index) => (
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
