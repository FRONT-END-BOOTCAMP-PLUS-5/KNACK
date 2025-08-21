import Text from '@/components/common/Text';
import styles from './searchBottomSheet.module.scss';
import { IPageCategory } from '@/types/category';
import TagButton from '@/components/common/TagButton';
import Flex from '@/components/common/Flex';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { useSearchParams } from 'next/navigation';

interface IProps {
  categories: IPageCategory[];
  selectedFilter: ISearchProductListRequest;
  onClickSubCategorySelect: (subCategoryId: number) => void;
}

export default function SearchCategory({ categories, selectedFilter, onClickSubCategorySelect }: IProps) {
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get('categoryId');

  const baseCategories = categories?.filter((category) => category.subCategories.length > 0) ?? [];
  let displayCategories = baseCategories;

  if (categoryIdParam) {
    const filtered = baseCategories.filter((category) => category.id === Number(categoryIdParam));
    displayCategories = filtered.length > 0 ? filtered : baseCategories;
  }

  const isSubCategorySelected = (subCategoryId: number): boolean => {
    return selectedFilter.subCategoryId?.includes(subCategoryId) || false;
  };

  return (
    <section className={styles.search_category}>
      {displayCategories.map((category) => (
        <div key={category.id} className={styles.search_category_item}>
          <Text
            tag="h4"
            size={1.4}
            weight={600}
            className={styles.search_category_title}
            paddingLeft={16}
            paddingRight={16}
            marginBottom={12}
          >
            {category.korName}
          </Text>
          <Flex direction="row" gap={8} paddingHorizontal={16} className={styles.search_price_button_wrap}>
            {category.subCategories.length > 0 &&
              category.subCategories.map((subCategory) => (
                <TagButton
                  key={subCategory.id}
                  isActive={isSubCategorySelected(subCategory.id)}
                  onClick={() => onClickSubCategorySelect(subCategory.id)}
                >
                  {subCategory.korName}
                </TagButton>
              ))}
          </Flex>
        </div>
      ))}
    </section>
  );
}
