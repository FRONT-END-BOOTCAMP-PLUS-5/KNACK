import Text from '@/components/common/Text';
import TagButton from '@/components/common/TagButton';
import styles from './searchBottomSheet.module.scss';
import { PRODUCT_FILTER_GENDER } from '@/constraint/product';
import { ISearchProductListRequest } from '@/types/searchProductList';

interface IProps {
  selectedFilter: ISearchProductListRequest;
  onClickGenderSelect: (gender: 'm' | 'f' | 'all') => void;
}
export default function SearchGender({ selectedFilter, onClickGenderSelect }: IProps) {
  const isGenderSelected = (gender: 'm' | 'f' | 'all') => {
    return selectedFilter.gender === gender;
  };

  return (
    <section className={styles.search_gender}>
      <Text
        tag="h4"
        size={1.4}
        weight={600}
        className={styles.search_gender_title}
        paddingLeft={16}
        paddingRight={16}
        marginBottom={12}
      >
        성별
      </Text>
      <div className={styles.search_gender_button_wrap}>
        {PRODUCT_FILTER_GENDER.map((item) => (
          <TagButton
            key={item.id}
            isActive={isGenderSelected(item.value)}
            onClick={() => onClickGenderSelect(item.value)}
          >
            {item.name}
          </TagButton>
        ))}
      </div>
    </section>
  );
}
