import { CATEGORY_ALL_TAB } from '@/constraint/header';
import styles from './header.module.scss';
import { useCallback, useEffect } from 'react';
import { categoryService } from '@/services/category';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCategoryStore } from '@/store/categoryStore';
import Skeleton from '@mui/material/Skeleton';

export default function HeaderCategory() {
  const { categories, setCategories } = useCategoryStore();
  const { getCategories } = categoryService;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      setCategories(res);
    } catch (error) {
      console.error('카테고리 데이터 호출 실패 : ', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCategories]);

  useEffect(() => {
    initCategories();
  }, [initCategories]);

  const isActive = (categoryId: number) => {
    const searchPath = pathname === '/search';
    const categoryIdParam = searchParams.get('categoryId');

    if (searchPath && !categoryIdParam) return categoryId === 0;
    if (searchPath && categoryIdParam && Number(categoryIdParam) === categoryId) {
      return categories.find((item) => item.id === categoryId);
    }
    return false;
  };

  return (
    <nav className={styles.tab_navigation} aria-label="카테고리 탭">
      <ul className={styles.tab_list}>
        <li key={0} className={styles.tab_item}>
          <Link href={'/search'} className={`${styles.tab_button} ${isActive(0) ? styles.active : ''}`}>
            {CATEGORY_ALL_TAB.name}
          </Link>
        </li>
        {categories.length > 0
          ? categories.map((item) => (
              <li key={item.id} className={styles.tab_item}>
                <Link
                  href={`/search?categoryId=${item.id}`}
                  className={`${styles.tab_button} ${isActive(item.id) ? styles.active : ''}`}
                >
                  {item.korName}
                </Link>
              </li>
            ))
          : Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className={styles.tab_item}>
                <Skeleton animation="wave" variant="rectangular" width={30} height={18} sx={{ margin: '12px 10px' }} />
              </li>
            ))}
      </ul>
    </nav>
  );
}
