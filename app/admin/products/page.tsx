'use client';

import Flex from '@/components/common/Flex';
import axios from 'axios';
import styles from './productsPage.module.scss';
import { useState } from 'react';

const ProductsPage = () => {
  const [korName, setKorName] = useState('');
  const [engName, setEngName] = useState('');
  const [price, setPrice] = useState(0);
  const [gender, setGender] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [subCategoryId, setSubCategoryId] = useState(0);
  const [brandId, setBrandId] = useState(0);
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [subImages, setSubImages] = useState('');

  const createProduct = () => {
    const data = {
      korName: korName,
      engName: engName,
      price: price,
      gender: gender,
      categoryId: categoryId,
      brandId: brandId,
      thumbnailImage: thumbnailImage,
      subImages: subImages,
      subCategoryId: subCategoryId,
    };

    axios
      .post('/api/admin/products', data)
      .then((res) => {
        console.log('res', res.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <div className={styles.container}>
      <Flex direction="column" gap={12}>
        <input type="text" placeholder="한글 상품명" onChange={(e) => setKorName(e.target.value)} />
        <input type="text" placeholder="영어 상품명" onChange={(e) => setEngName(e.target.value)} />
        <input type="number" placeholder="가격" onChange={(e) => setPrice(Number(e.target.value))} />
        <input type="text" placeholder="성별" onChange={(e) => setGender(e.target.value)} />
        <input type="text" placeholder="썸네일 이미지" onChange={(e) => setThumbnailImage(e.target.value)} />
        <input type="text" placeholder="슬라이드 이미지" onChange={(e) => setSubImages(e.target.value)} />
        <input type="number" placeholder="카테고리 아이디" onChange={(e) => setCategoryId(Number(e.target.value))} />
        <input
          type="number"
          placeholder="서브 카테고리 아이디"
          onChange={(e) => setSubCategoryId(Number(e.target.value))}
        />
        <input type="number" placeholder="브랜드 아이디" onChange={(e) => setBrandId(Number(e.target.value))} />
      </Flex>

      <button onClick={createProduct}>상품 추가하기</button>
    </div>
  );
};

export default ProductsPage;
