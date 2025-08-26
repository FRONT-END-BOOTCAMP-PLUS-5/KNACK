'use client';

import Image from 'next/image';
import styles from './productTopImage.module.scss';
import { STORAGE_PATHS } from '@/constraint/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/scrollbar';
import { useCallback, useEffect, useState } from 'react';
import { IRelationProducts } from '@/types/productDetail';
import { productsService } from '@/services/products';
import Link from 'next/link';

interface IProps {
  sliderImage: string;
  thumbnailImage: string;
  productId: number;
}

const ProductTopImage = ({ sliderImage, thumbnailImage, productId }: IProps) => {
  const sliderImages = sliderImage.split(',');
  const { getRelationProducts } = productsService;

  const [relations, setRelations] = useState<IRelationProducts[]>([]);

  const handleGetRelationProducts = useCallback(() => {
    getRelationProducts(productId)
      ?.then((res) => {
        if (res.result) {
          setRelations(res.result);
        }
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getRelationProducts, productId]);

  useEffect(() => {
    handleGetRelationProducts();
  }, [handleGetRelationProducts]);

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
        {relations?.map((item) => (
          <Link
            className={styles.slide_image_box}
            href={`/products/${item?.relatedProduct?.id}`}
            key={'relation_products_' + item?.relatedProduct?.id}
          >
            <Image
              width={56}
              height={56}
              src={`${STORAGE_PATHS?.PRODUCT?.THUMBNAIL}/${item?.relatedProduct?.thumbnailImage}`}
              alt={item?.relatedProduct?.korName}
            />
          </Link>
        ))}
      </article>
    </article>
  );
};

export default ProductTopImage;
