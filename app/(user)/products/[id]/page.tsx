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

const ProductDetail = async ({ params }: IProps) => {
  const { id } = await params;

  const { getProduct } = productsService;

  const productData: IProduct = await getProduct(Number(id)).then((res) => {
    return res.result;
  });

  if (!productData) {
    return <div>존재하지 않는 상품 입니다.</div>;
  }

  return (
    <DetailLayout>
      <SSRContent {...productData} />
    </DetailLayout>
  );
};

export default ProductDetail;
