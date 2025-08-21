'use client';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import styles from './bannerSlide.module.scss';
import Image from 'next/image';
import { useState } from 'react';

import mainBanner01 from '@/public/images/main_banner01.jpg';
import mainBanner02 from '@/public/images/main_banner02.jpg';
import mainBanner03 from '@/public/images/main_banner03.jpg';
import mainBanner04 from '@/public/images/main_banner04.png';
import mainBanner05 from '@/public/images/main_banner05.jpg';

const BannerSlide = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSwiper = (value: SwiperClass) => {
    setActiveIndex(value.activeIndex);
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
        <SwiperSlide className={styles.swiper_slide}>
          <div className={styles.image_box}>
            <Image src={mainBanner01} fill alt={'슬라이드 이미지1'} />
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiper_slide}>
          <div className={styles.image_box}>
            <Image src={mainBanner03} fill alt={'슬라이드 이미지2'} />
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiper_slide}>
          <div className={styles.image_box}>
            <Image src={mainBanner02} fill alt={'슬라이드 이미지3'} />
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiper_slide}>
          <div className={styles.image_box}>
            <Image src={mainBanner04} fill alt={'슬라이드 이미지4'} />
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiper_slide}>
          <div className={styles.image_box}>
            <Image src={mainBanner05} fill alt={'슬라이드 이미지5'} />
          </div>
        </SwiperSlide>
      </Swiper>
      <div className={styles.swiper_index}>{activeIndex} / 5</div>
    </div>
  );
};

export default BannerSlide;
