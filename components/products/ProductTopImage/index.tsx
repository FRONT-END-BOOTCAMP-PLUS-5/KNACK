'use client';

import Image from 'next/image';
import styles from './productTopImage.module.scss';
import { STORAGE_PATHS } from '@/constraint/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/scrollbar';

interface IProps {
  sliderImage: string;
  thumbnailImage: string;
}

const ProductTopImage = ({ sliderImage, thumbnailImage }: IProps) => {
  const sliderImages = sliderImage.split(',');

  return (
    <article>
      <Swiper
        scrollbar={{
          hide: false,
          horizontalClass: `${styles.scrollbar}`,
          dragClass: `${styles.drag}`,
        }}
        modules={[Scrollbar]}
        className="mySwiper"
      >
        {sliderImages?.map((item, index) => (
          <SwiperSlide key={item}>
            <div className={styles.image_box}>
              <span className={styles.slide_image_box}>
                <Image src={`${STORAGE_PATHS.PRODUCT.SLIDER}/${item}`} fill alt={'슬라이드 이미지' + index} />
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <article className={styles.slide_image_wrap}>
        <span className={styles.slide_image_box}>
          <Image
            src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${thumbnailImage}`}
            width={56}
            height={56}
            alt={'관련상품 이미지'}
          />
        </span>
      </article>
    </article>
  );
};

export default ProductTopImage;
