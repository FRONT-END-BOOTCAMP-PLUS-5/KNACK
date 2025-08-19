import SearchCsrWrapper from '@/components/search/SearchCsrWrapper';
import SearchProductList from '@/components/search/SearchProductList';
import SearchProductListEmpty from '@/components/search/SearchProductList/SearchProductListEmpty';
import { searchProductService } from '@/services/search';
import { ISearchProductListResponse } from '@/types/searchProductList';
import { IQueryParams, objectToQueryString } from '@/utils/queryString';

interface IProps {
  searchParams: Promise<IQueryParams>;
}

export default async function Search({ searchParams }: IProps) {
  const params = await searchParams;
  const { getSearchProductList } = searchProductService;
  const queryParams: IQueryParams = {
    keyword: params.keyword,
    keywordColorId: params.keywordColorId,
    brandId: params.brandId,
    categoryId: params.categoryId,
    subCategoryId: params.subCategoryId,
    price: params.price,
    size: params.size,
    discount: params.discount,
    benefit: params.benefit,
    gender: params.gender,
    sort: params.sort,
    cursor: params.cursor,
    soldOutInvisible: params.soldOutInvisible,
  };

  const qs = objectToQueryString(queryParams);

  const initialData: ISearchProductListResponse = await getSearchProductList(qs);

  if (!initialData || initialData.products.length === 0) {
    return <SearchProductListEmpty />;
  }

  return (
    <main>
      <SearchCsrWrapper queryParams={queryParams} />
      <SearchProductList initialData={initialData} />
    </main>
  );
}
