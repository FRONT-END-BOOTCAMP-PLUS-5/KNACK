import styles from './productDetail.module.scss';
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

interface IProps {
  params: Promise<{
    id: string;
  }>;
}



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
    <div className={styles.product_detail_container}>
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
      <BottomFixButton productData={productData} />
    </div>
  );
};

export default ProductDetail;
