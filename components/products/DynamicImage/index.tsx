'use client';

import Image from 'next/image';
import styles from './dynamicImage.module.scss';
import { useState } from 'react';

interface IProps {
  src: string;
  alt: string;
}

const DynamicImage = ({ src, alt }: IProps) => {
  const [imageRatio, setImageRatio] = useState(1);

  return (
    <div className={styles.image_box} style={{ paddingTop: imageRatio ? `${imageRatio * 100}%` : '100%' }}>
      <Image
        src={src}
        fill
        style={{
          objectFit: 'contain',
        }}
        onLoadingComplete={({ naturalWidth, naturalHeight }) => {
          setImageRatio(naturalHeight / naturalWidth);
        }}
        alt={alt}
      />
    </div>
  );
};

export default DynamicImage;
