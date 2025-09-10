import ProductTopImage from '@/components/products/ProductTopImage';
import DefaultInfo from '@/components/products/DefaultInfo';
import Divider from '@/components/common/Divider';
import DeliveryInfo from '@/components/products/DeliveryInfo';
import BrandInfo from '@/components/products/BrandInfo';
import Tab from '@/components/products/Tab';
import ProductDetailImage from '@/components/products/ProductDetailImage';
import TextReview from '@/components/products/TextReview';
import { productsService } from '@/services/products';
import AdditionalBenefits from '@/components/products/AdditionalBenefits';
import { IProduct } from '@/types/productDetail';
import BottomFixButton from '@/components/products/BottomFixButton';
import Recommends from '@/components/products/Recommends';
import DetailLayout from '@/components/products/DetailLayout';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createMetaData } from '@/utils/createMetaData';
import { STORAGE_PATHS } from '@/constraint/auth';
import { cache } from 'react';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

const SSRContent = (productData?: IProduct) => {
  if (!productData) return;

  return (
    <>
      <ProductTopImage
        productId={productData?.id}
        thumbnailImage={productData?.thumbnailImage ?? ''}
        sliderImage={productData?.subImages ?? ''}
      />
      <DefaultInfo data={productData} />
      <AdditionalBenefits />
      <Divider height={1} paddingHorizontal={16} />
      <DeliveryInfo />
      <Divider />
      <BrandInfo brandData={productData?.brand} />
      <Divider />
      <Tab />
      <ProductDetailImage detailImage={productData?.detailImages} />
      <TextReview productData={productData} />
      <Recommends />
      <BottomFixButton productData={productData} />
    </>
  );
};

const getProductData = cache(async (id: number): Promise<IProduct | null> => {
  try {
    const { getProduct } = productsService;
    const response = await getProduct(id);
    return response.result;
  } catch (error) {
    console.error('상품 데이터 조회 실패:', error);
    return null;
  }
});

export const generateMetadata = async ({ params }: IProps): Promise<Metadata> => {
  const { id } = await params;
  const productData = await getProductData(Number(id));

  if (!productData) {
    return createMetaData({
      title: 'Product | KNACK',
      description: '상품의 자세한 정보를 확인해보세요. | KNACK',
    });
  }

  return createMetaData({
    title: productData?.korName && `${productData?.korName} | KNACK`,
    description:
      productData?.korName && productData?.engName && `${productData.engName} - ${productData.korName} | KNACK`,
    ogImage: productData?.thumbnailImage && `${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${productData?.thumbnailImage}`,
  });
};

const ProductDetail = async ({ params }: IProps) => {
  const { id } = await params;

  const productData = await getProductData(Number(id));

  if (!productData) {
    return notFound();
  }

  return (
    <DetailLayout>
      <SSRContent {...productData} />
    </DetailLayout>
  );
};

export default ProductDetail;
