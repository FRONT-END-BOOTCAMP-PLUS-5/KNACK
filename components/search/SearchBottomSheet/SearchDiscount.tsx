import Text from '@/components/common/Text';
import styles from './searchBottomSheet.module.scss';
import Flex from '@/components/common/Flex';
import TagButton from '@/components/common/TagButton';
import { DiscountValue, PRODUCT_FILTER_DISCOUNT } from '@/constraint/product';
import { ISearchProductListRequest } from '@/types/searchProductList';

interface IProps {
  selectedFilter: ISearchProductListRequest;
  onClickDiscountSelect: (discountValue: DiscountValue) => void;
}
export default function SearchDiscount({ selectedFilter, onClickDiscountSelect }: IProps) {
  const isDiscountSelected = (discountValue: string): boolean => {
    return selectedFilter.discount === discountValue;
  };

  return (
    <article className={styles.search_discount}>
      <div>
        <Flex justify="between" align="start" className={styles.search_discount_title} paddingHorizontal={16}>
          <Text tag="h4" size={1.4} weight={600} marginBottom={12}>
            할인율
          </Text>
          <Text>모두 선택</Text>
        </Flex>
        <div className={styles.search_gender_button_wrap}>
          {PRODUCT_FILTER_DISCOUNT.map((item) => (
            <TagButton
              key={item.id}
              isActive={isDiscountSelected(item.value)}
              onClick={() => onClickDiscountSelect(item.value)}
            >
              {item.name}
            </TagButton>
          ))}
        </div>
      </div>
    </article>
  );
}
