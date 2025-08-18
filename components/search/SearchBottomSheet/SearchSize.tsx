import { IOption } from '@/types/option';
import { ISearchProductListRequest } from '@/types/searchProductList';
import styles from './searchBottomSheet.module.scss';
import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import TagButton from '@/components/common/TagButton';

interface IProps {
  selectedFilter: ISearchProductListRequest;
  sizes: IOption[];
  onClickSizeSelect: (size: string) => void;
}

export default function SearchSize({ selectedFilter, sizes, onClickSizeSelect }: IProps) {
  const isSizeSelected = (size: string): boolean => {
    return selectedFilter.size?.includes(size) || false;
  };

  return (
    <section className={styles.search_category}>
      {sizes &&
        sizes
          .filter((size) => size.optionValues.length > 0)
          .map((size) => (
            <div key={size.id} className={styles.search_category_item}>
              <Text
                tag="h4"
                size={1.4}
                weight={600}
                className={styles.search_category_title}
                paddingLeft={16}
                paddingRight={16}
                marginBottom={12}
              >
                {size.name}
              </Text>
              <Flex direction="row" gap={8} paddingHorizontal={16} className={styles.search_price_button_wrap}>
                {size.optionValues.map((optionValue) => (
                  <TagButton
                    key={optionValue.id}
                    isActive={isSizeSelected(optionValue.name)}
                    onClick={() => onClickSizeSelect(optionValue.name)}
                  >
                    {optionValue.name}
                  </TagButton>
                ))}
              </Flex>
            </div>
          ))}
    </section>
  );
}
