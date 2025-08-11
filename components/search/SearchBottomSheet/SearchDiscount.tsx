import Text from '@/components/common/Text';
import styles from './searchBottomSheet.module.scss';
import Flex from '@/components/common/Flex';
import TagButton from '@/components/common/TagButton';
import { PRODUCT_FILTER_DISCOUNT } from '@/constraint/product';

export default function SearchDiscount() {
  return (
    <article className={`${styles.search_discount} ${styles.contents_container}`}>
      <div>
        <Flex justify="between" align="start" className={styles.search_discount_title} paddingHorizontal={16}>
          <Text tag="h4" size={1.4} weight={600} marginBottom={12}>
            할인율
          </Text>
          <Text>모두 선택</Text>
        </Flex>
        <div className={styles.search_gender_button_wrap}>
          {PRODUCT_FILTER_DISCOUNT.map((item) => (
            <TagButton key={item.id} isActive={false}>
              {item.name}
            </TagButton>
          ))}
        </div>
      </div>
    </article>
  );
}
