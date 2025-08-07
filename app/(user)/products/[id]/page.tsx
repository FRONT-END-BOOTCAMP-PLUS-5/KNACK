import styles from './productDetail.module.scss';
import ProductTopImage from '@/components/products/ProductTopImage';
import DefaultInfo from '@/components/products/DefaultInfo';
import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import Divider from '@/components/common/Divider';
import AdditionalBnefits from '@/components/products/AdditionalBnefits';
import DeliveryInfo from '@/components/products/DeliveryInfo';
import BrandInfo from '@/components/products/BrandInfo';
import Tab from '@/components/products/Tab';
import ProductDetailImage from '@/components/products/ProductDetailImage';
import Button from '@/components/common/Button';

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

const ProductDetail = () => {
  return (
    <div className={styles.product_detail_container}>
      <ProductTopImage />
      <DefaultInfo />
      <AdditionalBnefits />
      <Divider height={1} paddingHorizontal={16} />
      <DeliveryInfo />
      <Divider />
      <BrandInfo />
      <Divider />
      <Tab />
      <ProductDetailImage />
      <section className={styles.review_container}>
        <Text tag="h2" size={1.7} weight={600} paddingTop={24} paddingBottom={16}>
          일반 리뷰 51
        </Text>
        <Flex gap={32}>
          <Text size={4} weight={700}>
            4.7
            <Text tag="span">★</Text>
          </Text>
          <Flex direction="column">
            {REVIEW_PROGRESS?.map((item) => (
              <Flex align="center" gap={8} key={item?.id} marginVertical={4}>
                <div className={styles.review_progress_bar}>
                  <div className={styles.progress} style={{ width: item.percent }} />
                </div>

                <Text className={styles.progress_rating} size={1.1} color="gray5">
                  {item?.rating}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
        <Flex direction="column" className={styles.review_result_text_wrap}>
          {REVIEW_RESULT_TEXT?.map((item) => (
            <Flex gap={8} key={item?.id} paddingVertical={6}>
              <Text tag="p" className={styles.result_title} size={1.4}>
                {item?.normal}
                <Text tag="span" size={1.4} weight={600}>
                  {item?.bold}
                </Text>
              </Text>
              <Text size={1.4} weight={600}>
                {item?.percent}
              </Text>
            </Flex>
          ))}
        </Flex>
        <Button text="리뷰 더보기" size="large" style="border" />
      </section>
    </div>
  );
};

export default ProductDetail;
