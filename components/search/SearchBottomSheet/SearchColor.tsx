import { PRODUCT_FILTER_COLOR } from '@/constraint/product';
import Text from '@/components/common/Text';
import styles from './searchBottomSheet.module.scss';
import Image from 'next/image';
import CheckWhite from '@/public/icons/check_white.svg';
import CheckBlack from '@/public/icons/check.svg';
import { ISearchProductListRequest } from '@/types/searchProductList';

const CHECK_ICON_BLACK = ['white', 'ivory', 'yellow'];

interface IProps {
  selectedFilter: ISearchProductListRequest;
  onClickColorSelect: (colorId: number) => void;
}
export default function SearchColor({ selectedFilter, onClickColorSelect }: IProps) {
  const isColorSelected = (colorId: number) => {
    return selectedFilter.keywordColorId?.includes(colorId) || false;
  };
  return (
    <ul className={styles.search_color}>
      {PRODUCT_FILTER_COLOR.map((item) => (
        <li className={styles.search_color_item} key={item.id} onClick={() => onClickColorSelect(item.id)}>
          <div className={styles.search_color_item_box}>
            {isColorSelected(item.id) && (
              <Image
                src={CHECK_ICON_BLACK.includes(item.engName) ? CheckBlack : CheckWhite}
                alt="check"
                width={20}
                height={20}
                className={styles.check_icon}
              />
            )}
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
