import SearchFilter from '@/components/search/SearchFilter';
import SearchProductList from '@/components/search/SearchProductList';
import SearchSort from '@/components/search/SearchSort';

export default function Search() {
  return (
    <div>
      <SearchFilter />
      <SearchSort />
      <SearchProductList />
    </div>
  );
}
