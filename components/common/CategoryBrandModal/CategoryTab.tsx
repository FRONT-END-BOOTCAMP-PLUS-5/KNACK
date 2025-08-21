'use client';
import styles from './categoryBrandModal.module.scss';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import { IPageCategory } from '@/types/category';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface IProps {
  categoryList: IPageCategory[];
  handleCategoryBrandModalOpen: (state: boolean) => void;
}

export default function CategoryTab({ categoryList, handleCategoryBrandModalOpen }: IProps) {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const subCategoryContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: number]: HTMLLIElement | null }>({});

  const handleSubCategoryClick = (subCategoryId: number) => {
    router.push(`/search?subCategoryId=${subCategoryId}`);
    handleCategoryBrandModalOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = parseInt(entry.target.getAttribute('data-category-id') || '0');
            setActiveCategoryId(categoryId);
          }
        });
      },
      {
        root: subCategoryContainerRef.current,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    Object.values(categoryRefs.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categoryList]);

  const handleCategoryClick = (categoryId: number) => {
    const targetElement = categoryRefs.current[categoryId];
    if (targetElement && subCategoryContainerRef.current) {
      const container = subCategoryContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = targetElement.getBoundingClientRect();
      const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 20;

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });

      setActiveCategoryId(categoryId);
    }
  };

  return (
    <section className={styles.category_container}>
      <aside className={styles.category_aside}>
        <ul className={styles.category_list}>
          {categoryList.map((category) => (
            <li
              className={`${styles.category_item} ${activeCategoryId === category.id ? styles.active : ''}`}
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              <p className={styles.category_item_text}>{category.korName}</p>
            </li>
          ))}
        </ul>
      </aside>
      {categoryList.length > 0 && (
        <div className={styles.sub_category_container} ref={subCategoryContainerRef}>
          <ul className={styles.sub_category_list}>
            {categoryList.map((category) => (
              <li
                className={styles.sub_category_item}
                key={category.id}
                data-category-id={category.id}
                ref={(el) => {
                  categoryRefs.current[category.id] = el;
                }}
              >
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
