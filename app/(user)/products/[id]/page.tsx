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

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

const SSRContent = (productData?: IProduct) => {
  if (!productData) return;

  return (
    <>
      <ProductTopImage thumbnailImage={productData?.thumbnailImage ?? ''} sliderImage={productData?.subImages ?? ''} />
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

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { getProduct } = productsService;
    const productData: IProduct = await getProduct(Number(id)).then((res) => {
      return res.result;
    });

    return {
      title: `${productData.korName} | KNACK`,
      description: `${productData.engName} - ${productData.korName} | KNACK`,
    };
  } catch (error) {
    console.error('상품 메타데이터 조회 실패:', error);

    return {
      title: 'Product | KNACK',
      description: 'KNACK에서 다양한 상품을 확인해보세요.',
    };
  }
}

const ProductDetail = async ({ params }: IProps) => {
  const { id } = await params;

  const { getProduct } = productsService;

  const productData: IProduct = await getProduct(Number(id)).then((res) => {
    return res.result;
  });

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
