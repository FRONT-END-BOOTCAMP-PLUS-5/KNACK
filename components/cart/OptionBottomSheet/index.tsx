'use client';

import BottomSheet from '@/components/common/BottomSheet';
import styles from './optionBottomSheet.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Image from 'next/image';
import Divider from '@/components/common/Divider';
import Button from '@/components/common/Button';
import { STORAGE_PATHS } from '@/constraint/auth';
import { ICart } from '@/types/cart';

interface IProps {
  selectedCart: ICart;
  selectOptionId: number;
  setSelectOptionId: (id: number) => void;
  handleOptionChange: () => void;
}

const OptionBottomSheet = ({ selectedCart, selectOptionId, handleOptionChange, setSelectOptionId }: IProps) => {
  return (
    <BottomSheet>
      <Flex justify="center" paddingVertical={16}>
        <Text tag="h2" size={1.8} weight={600}>
          옵션 변경
        </Text>
      </Flex>
      <section className={styles.option_sheet_product}>
        <span className={styles.image}>
          <Image
            src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${selectedCart?.product?.thumbnailImage}`}
            width={56}
            height={56}
            alt="썸네일"
          />
        </span>
        <Flex direction="column" width="self" gap={2}>
          <Text size={1.4} color="black1">
            {selectedCart?.product?.korName}
          </Text>
          <Text size={1.3} color="gray1">
            {selectedCart?.product?.engName}
          </Text>
        </Flex>
      </section>
      <Divider height={1} />
      <section className={styles.option_flex_wrap}>
        {selectedCart?.product?.productOptionMappings[0]?.optionType?.optionValue?.map((item, index) => (
          <button
            key={index}
            className={`${styles.option_button} ${selectOptionId === item?.id && styles.active}`}
            onClick={() => setSelectOptionId(item?.id)}
          >
            {item?.name}
          </button>
        ))}
      </section>
      <div className={styles.option_change_button_wrap}>
        <Button size="large" style="black" text="확인" onClick={handleOptionChange} />
      </div>
    </BottomSheet>
  );
};

export default OptionBottomSheet;
