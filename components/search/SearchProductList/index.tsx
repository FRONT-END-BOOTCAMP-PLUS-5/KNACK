'use client';
import { GetProductsResponseDto } from '@/backend/search/applications/dtos/GetProductsDto';
import styles from './searchProductList.module.scss';
import { ProductCardLarge } from '@/components/common/ProductCard';

interface IProps {
  initialData: GetProductsResponseDto;
}

export default function SearchProductList({ initialData }: IProps) {
  return (
    <>
      {initialData.products.length > 0 && (
        <div className={styles.search_product_list}>
          {initialData.products.map((product, index) => (
            <ProductCardLarge key={index} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
