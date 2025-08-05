import styles from './search_product_list.module.scss';
import { ProductCardLarge } from '@/components/common/ProductCard';

export default function SearchProductList() {
  return (
    <div className={styles.search_product_list}>
      {Array.from({ length: 20 }).map((_, index) => (
        <ProductCardLarge key={index} />
      ))}
    </div>
  );
}
