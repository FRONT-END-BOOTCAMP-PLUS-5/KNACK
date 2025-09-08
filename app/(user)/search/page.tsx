import SearchCsrWrapper from '@/components/search/SearchCsrWrapper';
import SearchProductList from '@/components/search/SearchProductList';
import { searchProductService } from '@/services/search';
import { ISearchProductListResponse } from '@/types/searchProductList';
import { IQueryParams, objectToQueryString } from '@/utils/queryString';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { createMetaData } from '@/utils/createMetaData';
import { Metadata } from 'next';

interface IProps {
  searchParams: Promise<IQueryParams>;
}

export const metadata: Metadata = createMetaData({
  title: 'SHOP | KNACK',
});

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
    const session = await getServerSession(authOptions);
    const initialData: ISearchProductListResponse = await searchProductService.getSearchProductList(
      queryString,
      session?.user.id
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
