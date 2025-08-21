'use client';
import styles from './categoryBrandModal.module.scss';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { IPageCategory } from '@/types/category';
import { useRouter } from 'next/navigation';

interface IProps {
  categoryList: IPageCategory[];
  handleCategoryBrandModalOpen: (state: boolean) => void;
}

export default function CategoryTab({ categoryList, handleCategoryBrandModalOpen }: IProps) {
  const router = useRouter();

  const handleSubCategoryClick = (subCategoryId: number) => {
    router.push(`/search?subCategoryId=${subCategoryId}`);
    handleCategoryBrandModalOpen(false);
  };
  return (
    <section className={styles.category_container}>
      <aside className={styles.category_aside}>
        <ul className={styles.category_list}>
          {categoryList.map((category) => (
            <li className={styles.category_item} key={category.id}>
              <p className={styles.category_item_text}>{category.korName}</p>
            </li>
          ))}
        </ul>
      </aside>
      {categoryList.length > 0 && (
        <div className={styles.sub_category_container}>
          <ul className={styles.sub_category_list}>
            {categoryList.map((category) => (
              <li className={styles.sub_category_item} key={category.id}>
                <h4 className={styles.category_name}>{category.korName}</h4>
                <p className={styles.category_text}>카테고리</p>
                <ul className={styles.sub_category_item_list}>
                  {category.subCategories.map((subCategory) => (
                    <li
                      className={styles.sub_category_item_list_item}
                      key={subCategory.id}
                      onClick={() => {
                        handleSubCategoryClick(subCategory.id);
                      }}
                    >
                      <div className={styles.sub_category_item_image_wrapper}>
                        <Image
                          fill
                          className={styles.sub_category_item_image}
                          src={`${STORAGE_PATHS.PRODUCT.CATEGORY}/${subCategory.image}`}
                          alt={subCategory.korName}
                        />
                      </div>
                      <p className={styles.sub_category_item_text}>{subCategory.korName}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
