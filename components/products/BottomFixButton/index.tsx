'use client';

import Image from 'next/image';
import styles from './bottomFixButton.module.scss';
import Text from '@/components/common/Text';

import SaveIcon from '@/public/icons/book_mark.svg';
import { useBottomSheetStore } from '@/store/bottomSheetStore';
import OptionBottomSheet from '../OptionBottomSheet';
import { IProduct } from '@/types/productDetail';

interface IProps {
  productData?: IProduct;
}

const BottomFixButton = ({ productData }: IProps) => {
  const { onOpen, onClose } = useBottomSheetStore();

  return (
    <>
      <div className={styles.bottom_fix_wrap}>
        <article className={styles.contents}>
          <div className={styles.icon_wrap}>
            <Image src={SaveIcon} width={18} height={18} alt="좋아요 아이콘" />
            <Text size={1.3} color="gray3" weight={600}>
              0
            </Text>
          </div>
          <button className={styles.buy_button} onClick={onOpen}>
            <Text className={styles.but_text} size={1.5} color="white" weight={700}>
              구매
            </Text>
            <Text className={styles.price} size={1.5} color="white" weight={600} paddingLeft={12}>
              {productData?.price?.toLocaleString()}원
            </Text>
          </button>
        </article>
      </div>
      <OptionBottomSheet productData={productData} />
    </>
  );
};

export default BottomFixButton;
