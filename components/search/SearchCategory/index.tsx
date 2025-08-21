import { useCategoryStore } from '@/store/categoryStore';
import { useSearchParams } from 'next/navigation';
import { CATEGORY_ALL_TAB } from '@/constraint/header';
import styles from './searchCategory.module.scss';
import Link from 'next/link';
import Text from '@/components/common/Text';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import defaultCategoryImage from '@/public/images/popular_tshirt.webp';

export default function SearchCategory() {
  const searchParams = useSearchParams();
  const { categories } = useCategoryStore();
  const categoryIdParam = searchParams.get('categoryId');
  const keywordParam = searchParams.get('keyword');

  const isAllTab = () => {
    if (!categoryIdParam && !keywordParam) return true;
    return false;
  };
  const findCategory = () => {
    if (!isAllTab() && categoryIdParam) {
      return categories.find((category) => category.id === Number(categoryIdParam));
    }
    return undefined;
  };

  const category = findCategory();

  return (
    <section>
      {category ? (
        <section>
          <ul className={styles.subCategory_list}>
            {category.subCategories.slice(0, 10).map((item) => (
              <li key={`sub-category-all-${item.id}`} className={styles.subCategory_list_item}>
                <Link href={`/search?subCategoryId=${item.id}`} className={styles.subCategory_list_item_link}>
                  <Image
                    className={styles.subCategory_list_item_link_image}
                    src={`${STORAGE_PATHS.PRODUCT.CATEGORY}/${item.image ?? ''}`}
                    alt={item.korName + '서브 카테고리 이미지'}
                    width={68}
                    height={68}
                    priority
                  />
                  <Text className={styles.subCategory_list_item_link_text}>{item.korName}</Text>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section>
          <ul className={styles.subCategory_list}>
            {CATEGORY_ALL_TAB.subCategories.map((item) => (
              <li key={`sub-category-all-${item.id}`} className={styles.subCategory_list_item}>
                <Link href={item.url} className={styles.subCategory_list_item_link}>
                  <Image
                    className={styles.subCategory_list_item_link_image}
                    src={`${item.image ?? defaultCategoryImage}`}
                    alt={item.name + '서브 카테고리 이미지'}
                    width={68}
                    height={68}
                    priority
                  />
                  <Text className={styles.subCategory_list_item_link_text}>{item.name}</Text>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
