import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const FILTER_KEYS = ['categoryId', 'subCategoryId', 'keyword'];

export const useClearProductFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearFilters = () => {
    const newParams = new URLSearchParams();

    FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) newParams.set(key, value);
    });
    router.push(`/search?${newParams.toString()}`);
  };

  return { clearFilters };
};
