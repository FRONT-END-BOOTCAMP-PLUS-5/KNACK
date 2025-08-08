import { GetProductsResponseDto } from '@/backend/search/applications/dtos/GetProductsDto';
import SearchBottomSheet from '@/components/search/SearchBottomSheet';
import SearchFilter from '@/components/search/SearchFilter';
import SearchProductList from '@/components/search/SearchProductList';
import SearchSort from '@/components/search/SearchSort';

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const basedUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = new URL(`${basedUrl}/api/search`);

  const keyword = params.keyword as string;
  const color = params.color as string;
  const brandId = params.brandId as string;
  const categoryId = params.categoryId as string;
  const subCategoryId = params.subCategoryId as string;
  const priceMin = params.priceMin as string;
  const priceMax = params.priceMax as string;
  const discountMin = params.discountMin as string;
  const discountMax = params.discountMax as string;
  // const size = params.size as string;
  const benefit = params.benefit as string;
  const sort = params.sort as string;
  const cursor = params.cursor as string;
  const limit = params.limit as string;

  if (keyword) {
    url.searchParams.set('keyword', keyword);
  }
  if (color) {
    url.searchParams.set('color', color);
  }
  if (brandId) {
    url.searchParams.set('brandId', brandId);
  }
  if (categoryId) {
    url.searchParams.set('categoryId', categoryId);
  }
  if (subCategoryId) {
    url.searchParams.set('subCategoryId', subCategoryId);
  }
  if (priceMin) {
    url.searchParams.set('priceMin', priceMin);
  }
  if (priceMax) {
    url.searchParams.set('priceMax', priceMax);
  }
  if (discountMin) {
    url.searchParams.set('discountMin', discountMin);
  }
  if (discountMax) {
    url.searchParams.set('discountMax', discountMax);
  }
  // if (size) {
  //   url.searchParams.set('size', size);
  // }
  if (benefit) {
    url.searchParams.set('benefit', benefit);
  }
  if (sort) {
    url.searchParams.set('sort', sort);
  }
  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }
  if (limit) {
    url.searchParams.set('limit', limit);
  }
  const res = await fetch(url);
  const initialData: GetProductsResponseDto = await res.json();
  console.log('@@@@@initialData: ' + JSON.stringify(initialData));

  return (
    <main>
      <SearchFilter />
      <SearchSort />
      <SearchProductList initialData={initialData} />
      <SearchBottomSheet />
    </main>
  );
}
