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

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

const REVIEW_PROGRESS = [
  { id: 0, percent: '80%', rating: 5 },
  { id: 1, percent: '23%', rating: 4 },
  { id: 2, percent: '15%', rating: 3 },
  { id: 3, percent: '10%', rating: 2 },
  { id: 4, percent: '4%', rating: 1 },
];

const REVIEW_RESULT_TEXT = [
  { id: 0, normal: '두께감이', bold: '보통이에요', percent: '75%' },
  { id: 1, normal: '무게감이', bold: '보통이에요', percent: '80%' },
  { id: 2, normal: '퀄리티가', bold: '만족스러워요', percent: '74%' },
];

const ProductDetail = async ({ params }: IProps) => {
  const { id } = await params;

  const { getProduct } = productsService;

  const productData: IProduct = await getProduct(Number(id)).then((res) => {
    return res;
  });

  return (
    <div className={styles.product_detail_container}>
      <ProductTopImage thumbnailImage={productData?.thumbnailImage} sliderImage={productData?.subImages ?? ''} />
      <DefaultInfo data={productData} />
      <AdditionalBenefits />
      <Divider height={1} paddingHorizontal={16} />
      <DeliveryInfo />
      <Divider />
      <BrandInfo brandData={productData?.brand} />
      <Divider />
      <Tab />
      <ProductDetailImage detailImage={productData?.detailContents} />
      <TextReview reviewProgress={REVIEW_PROGRESS} reviewTextData={REVIEW_RESULT_TEXT} />
    </div>
  );
};

export default ProductDetail;
