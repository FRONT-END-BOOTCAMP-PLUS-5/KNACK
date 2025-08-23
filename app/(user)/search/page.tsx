import SearchCsrWrapper from '@/components/search/SearchCsrWrapper';
import SearchProductList from '@/components/search/SearchProductList';
import { searchProductService } from '@/services/search';
import { ISearchProductListResponse } from '@/types/searchProductList';
import { IQueryParams, objectToQueryString } from '@/utils/queryString';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import { cookies } from 'next/headers';

interface IProps {
  searchParams: Promise<IQueryParams>;
}

export default async function Search({ searchParams }: IProps) {
  const params = await searchParams;

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
  const queryString = objectToQueryString(queryParams);

  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('next-auth.session-token')?.value;
    const csrfToken = cookieStore.get('next-auth.csrf-token')?.value;

    const initialData: ISearchProductListResponse = await searchProductService.getSearchProductListSSR(
      queryString,
      sessionToken,
      csrfToken
    );
    return (
      <main>
        <SearchCsrWrapper queryParams={queryParams} />
        <SearchProductList initialData={initialData} />
      </main>
    );
  } catch (error) {
    console.error('상품 리스트 조회 실패 : ', error);
    return (
      <main>
        <SearchCsrWrapper queryParams={queryParams} />
        <Flex justify="center" align="center" paddingVertical={200}>
          <Text tag="p" size={1.8} weight={600} color="lightGray1">
            상품 리스트 조회 실패
          </Text>
        </Flex>
      </main>
    );
  }
}
