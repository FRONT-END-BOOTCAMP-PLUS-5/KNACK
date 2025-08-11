import { GetProductsResponseDto } from '@/backend/search/applications/dtos/GetProductsDto';
import SearchCsrWrapper from '@/components/search/SearchCsrWrapper';
import SearchProductList from '@/components/search/SearchProductList';

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const basedUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = new URL(`${basedUrl}/api/search`);

  const queryParams = {
    keyword: params.keyword,
    keywordColorId: params.keywordColorId,
    brandId: params.brandId,
    categoryId: params.categoryId,
    subCategoryId: params.subCategoryId,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    size: params.size,
    discountMin: params.discountMin,
    discountMax: params.discountMax,
    benefit: params.benefit,
    gender: params.gender,
    sort: params.sort,
    cursor: params.cursor,
    limit: params.limit,
    soldOutInvisible: params.soldOutInvisible,
  };

  for (const [key, value] of Object.entries(queryParams)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url);
  const initialData: GetProductsResponseDto = await res.json();

  return (
    <main>
      <SearchCsrWrapper />
      <SearchProductList initialData={initialData} />
    </main>
  );
}
