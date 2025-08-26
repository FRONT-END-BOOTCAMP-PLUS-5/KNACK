'use client';

import styles from './optionBottomSheet.module.scss';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import Divider from '@/components/common/Divider';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import { STORAGE_PATHS } from '@/constraint/auth';
import { IProduct } from '@/types/productDetail';
import Image from 'next/image';

interface IProps {
  productData?: IProduct;
  selectOptionId: number;
  deliveryOptionId: number;
  setSelectOptionId: (id: number) => void;
  setDeliveryOption: (id: number) => void;
  onClickCart?: () => void;
  onClickBuy?: () => void;
}

const OptionBottomSheet = ({
  productData,
  selectOptionId,
  deliveryOptionId,
  setSelectOptionId,
  setDeliveryOption,
  onClickCart,
  onClickBuy,
}: IProps) => {
  const { thumbnailImage, korName, engName, productOptionMappings, modelNumber, price } = productData ?? {};

  return (
    <BottomSheet style={{ padding: 0 }}>
      <Flex justify="center" paddingVertical={16}>
        <Text tag="h2" size={1.8} weight={600}>
          구매 하기
        </Text>
      </Flex>
      <section className={styles.option_sheet_product}>
        <span className={styles.image}>
          <Image src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${thumbnailImage}`} width={56} height={56} alt="썸네일" />
        </span>
        <Flex direction="column" width="self" gap={2}>
          <Text size={1.4} color="black1">
            {engName}
          </Text>
          <Text size={1.3} color="gray6">
            {korName}
          </Text>
          <Text size={1.2} color="gray6">
            {modelNumber}
          </Text>
        </Flex>
      </section>
      <Divider height={1} />
      <section className={styles.option_flex_wrap}>
        {productOptionMappings?.[0]?.optionType?.optionValue?.map((item, index) => (
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
        <Flex direction="column" gap={6}>
          <button
            className={`${styles.price_select_button} ${deliveryOptionId === 0 && styles.active}`}
            onClick={() => setDeliveryOption(0)}
          >
            <Flex gap={4} width="self" align="center">
              <Text size={1.4} weight={deliveryOptionId === 0 ? 600 : 400}>
                빠른배송
              </Text>
              <Text size={1.2} color="gray2">
                1-2일
              </Text>
            </Flex>
            <Text
              className={styles.price_text}
              size={1.4}
              weight={deliveryOptionId === 0 ? 600 : 400}
              color={deliveryOptionId === 0 ? 'red1' : 'black1'}
            >
              {((price ?? 0) + 30000)?.toLocaleString()}원
            </Text>
          </button>
          <button
            className={`${styles.price_select_button} ${deliveryOptionId === 1 && styles.active}`}
            onClick={() => setDeliveryOption(1)}
          >
            <Flex gap={4} width="self" align="center">
              <Text size={1.4} weight={deliveryOptionId === 1 ? 600 : 400}>
                일반배송
              </Text>
              <Text size={1.2} color="gray2">
                5-7일
              </Text>
            </Flex>
            <Text
              className={styles.price_text}
              size={1.4}
              weight={deliveryOptionId === 1 ? 600 : 400}
              color={deliveryOptionId === 1 ? 'red1' : 'black1'}
            >
              {price?.toLocaleString()}원
            </Text>
          </button>
        </Flex>
        <Flex gap={6}>
          <Button size="large" style="black" text="장바구니 담기" onClick={onClickCart} />
          <Button size="large" style="orange" text="즉시 구매하기" onClick={onClickBuy} />
        </Flex>
      </div>
    </BottomSheet>
  );
};

export default OptionBottomSheet;
