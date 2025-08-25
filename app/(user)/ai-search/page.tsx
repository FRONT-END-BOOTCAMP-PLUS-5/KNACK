'use client';

import Flex from '@/components/common/Flex';
import styles from './aiSearch.module.scss';
import DynamicImage from '@/components/products/DynamicImage';
import { STORAGE_PATHS } from '@/constraint/auth';
import { productsService } from '@/services/products';
import { IProduct } from '@/types/productDetail';
import { GoogleGenAI } from '@google/genai';
import CircularProgress from '@mui/material/CircularProgress';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import Text from '@/components/common/Text';
import Link from 'next/link';

interface ImageDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}
interface TextPart {
  text: string;
}
type GeminiContentPart = ImageDataPart | TextPart;
type Base64ImageState = GeminiContentPart[];

const AiSearchPage = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

  const { onOpen } = useBottomSheetStore();
  const { getProduct, getProductsThumbnail } = productsService;

  const [loading, setLoading] = useState(false);
  const [base64Image, setBase64Image] = useState<Base64ImageState[]>([]);
  const [product, setProduct] = useState<IProduct>();
  const [uploadImage, setUploadImage] = useState<string | ArrayBuffer | null>();
  const [thumbnailList, setThumbnailLise] = useState<Base64ImageState[]>([]);

  const aiHandler = async () => {
    if (!uploadImage) {
      return alert('찾으실 상품 이미지를 올려주세요!');
    }

    setLoading(true);

    const flatBase64Image = base64Image?.flatMap((item) => item);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...flatBase64Image,
        {
          text: '마지막 이미지와 가장 비슷한 이미지를 첫번째와 마지막 전까지 이미중에 다 비교해보고 색상과, 옷의 질감 등을 고려해서 3번정도 다시 생각해보고 찾아주고 전에 요청한 이미지랑 상관관계 생각하지 말고 찾아줘 대답은 다른말 필요없이 아이디만 알려줘  ',
        },
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    setLoading(false);
    onOpen();

    getProduct(Number(response.text) ?? 0).then((res) => {
      setProduct(res.result);
    });
  };

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUploadImage(reader.result);
      setBase64Image(thumbnailList);

      setBase64Image((prev) => [
        ...prev,
        [
          {
            inlineData: {
              data: reader.result?.toString().split(',')[1] ?? '',
              mimeType: reader.result?.toString().split(';')[0].split(':')[1] ?? '',
            },
          },
          {
            text: '',
          },
        ],
      ]);
    };
  };

  const handelGetThumbnail = useCallback(() => {
    getProductsThumbnail().then((res) => {
      if (res) {
        setBase64Image(res.result);
        setThumbnailLise(res.result);
      }
    });
  }, [getProductsThumbnail]);

  useEffect(() => {
    handelGetThumbnail();
  }, [handelGetThumbnail]);

  return (
    <section className={styles.ai_search_container}>
      <Text size={1.5} marginBottom={12} weight={600}>
        이미지로 상품을 검색해보세요!
      </Text>
      <input id="fileInput" className={styles.file_input} onChange={fileHandler} type="file" />
      <label htmlFor="fileInput" className={styles.file_label}>
        <div className={styles.upload_image}>
          {uploadImage && <DynamicImage src={uploadImage?.toString() ?? ''} alt="업로드 이미지" />}
        </div>
        {!uploadImage && <span className={styles.upload_text}>이미지</span>}
      </label>

      <Flex justify="center" align="center" marginVertical={20} gap={10}>
        <button className={`${styles.search_button} ${uploadImage && styles.active} `} onClick={aiHandler}>
          찾아보기
        </button>
        <button className={styles.search_reset} onClick={() => setUploadImage('')}>
          초기화
        </button>
      </Flex>

      {loading && (
        <div className={styles.spinner_box}>
          <CircularProgress color="inherit" />
        </div>
      )}

      <BottomSheet>
        <section className={styles.bottom_sheet_container}>
          <Link href={`/products/${product?.id}`}>
            <div className={styles.result_image}>
              {product?.thumbnailImage && (
                <DynamicImage
                  src={`${STORAGE_PATHS?.PRODUCT?.THUMBNAIL}/${product?.thumbnailImage}`}
                  alt="썸네일이미지"
                />
              )}
            </div>
          </Link>
          <Flex gap={8} direction="column" align="center" paddingVertical={20}>
            <Text className={styles.main_text} size={1.4}>
              {product?.engName}
            </Text>
            <Text className={styles.sub_text} size={1.3} color="gray1">
              {product?.korName}
            </Text>
            <Text className={styles.price} size={1.3}>
              {product?.price?.toLocaleString()}원
            </Text>
          </Flex>
        </section>
      </BottomSheet>
    </section>
  );
};

export default AiSearchPage;
