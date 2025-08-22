'use client';

import styles from './bannerSlide.module.scss';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import MainBannerContent from '../MainBannerContent';
import { SLIDES_IMAGE } from '@/constraint/main';

const BannerSlide = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const handleSwiper = (value: SwiperClass) => {
    setActiveIndex(value.activeIndex + 1);
  };

  return (
    <div className={styles.swiper_container}>
      <Swiper
        slidesPerView={'auto'}
        centeredSlides={true}
        spaceBetween={15}
        onActiveIndexChange={(index) => handleSwiper(index)}
        className="mySwiper"
        autoplay={{ delay: 1000 }}
      >
        {SLIDES_IMAGE?.map((item, index) => (
          <SwiperSlide className={styles.swiper_slide} key={'main_banner_slide_' + index}>
            <MainBannerContent
              src={item?.src?.src}
              mainText={item?.mainText}
              subText={item?.subText}
              alt={item?.mainText}
              textColor={item?.textColor}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.swiper_index}>{activeIndex} / 5</div>
    </div>
  );
};

export default BannerSlide;
