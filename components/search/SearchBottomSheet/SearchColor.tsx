import { PRODUCT_FILTER_COLOR } from '@/constraint/product';
import Text from '@/components/common/Text';
import styles from './searchBottomSheet.module.scss';
import Image from 'next/image';

export default function SearchColor() {
  return (
    <ul className={`${styles.search_color} ${styles.contents_container}`}>
      {PRODUCT_FILTER_COLOR.map((item) => (
        <li className={styles.search_color_item} key={item.id}>
          <div className={styles.search_color_item_box}>
            {item.color && <div style={{ backgroundColor: item.color }} />}
            {item.image && <Image src={item.image} alt={item.korName} fill={true} />}
          </div>
          <Text tag="p" size={1.3} weight={400} color="gray2">
            {item.korName}
          </Text>
        </li>
      ))}
    </ul>
  );
}
