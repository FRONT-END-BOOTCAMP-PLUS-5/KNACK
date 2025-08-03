'use client';

import Divider from '@/components/common/Divider';
import styles from './cartPage.module.scss';
import ChipButton from '@/components/common/ChipButton';
import Checkbox from '@/components/common/Checkbox';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';

const DELIVERY_DESCRIPTION_TEXT = [
  '배송 방법 및 쿠폰/포인트 적용 여부는 결제 시 선택할 수 있습니다.',
  '총 결제금액은 배송 방법 및 쿠폰/포인트 적용 여부에 따라 달라질 수 있습니다.',
  '예상 결제금액은 기본 배송 방법 및 일반 결제로 주문했을 때의 가격입니다.',
  '장바구니에는 KNACK 배송 상품과 브랜드 배송 상품을 각각 최대 30개까지 담을 수 있으며, 상품은 최대 365일까지 보관됩니다.',
];

const CartPage = () => {
  return (
    <article>
      <section className={styles.all_select_bar}>
        <div className={styles.select_input_box}>
          <Checkbox id="allSelect" />
          <label htmlFor="allSelect">전체 선택</label>
        </div>
        <ChipButton text="선택 삭제" />
      </section>
      <Divider />
      <section>
        <section className={styles.item_select_bar}>
          <Checkbox />
          <ChipButton text="삭제" />
        </section>
        <Link href={'/'} className={styles.item_info_wrap}>
          <span className={styles.item_image}>이미지</span>
          <div className={styles.item_info}>
            <h3 className={styles.main_text}>메인 타이틀</h3>
            <p className={styles.sub_text}>서브타이틀</p>
            <p className={styles.option_text}>옵션</p>
          </div>
        </Link>
        <div className={styles.item_price}>
          <p className={styles.price_title}>상품금액</p>
          <p className={styles.price}>249,000원</p>
        </div>
        <div className={styles.delivery_price}>
          <p className={styles.delivery_title}>배송비</p>
          <p className={styles.price}>무료</p>
        </div>
        <section className={styles.button_wrap}>
          <Button text="옵션/배송 변경" />
          <Button text="바로 주문" style="black" />
        </section>
        <Divider />
        <section className={styles.select_order_info_wrap}>
          <h2 className={styles.select_order_title}>선택 주문정보</h2>
          <Divider height={1} paddingHorizontal={16} />
          <Flex paddingHorizontal={16} paddingVertical={12} gap={4} direction="column">
            <Flex justify="between" paddingVertical={3}>
              <Text size={1.4} color="gray1">
                총 상품금액
              </Text>
              <Text size={1.4} color="black1">
                397,2000원
              </Text>
            </Flex>
            <Flex justify="between" paddingVertical={3}>
              <Text size={1.4} color="gray1">
                총 배송비
              </Text>
              <Text size={1.4} color="black1">
                무료
              </Text>
            </Flex>
          </Flex>
          <Divider height={1} paddingHorizontal={16} />
          <Flex justify="between" paddingVertical={15} paddingHorizontal={16} align="center">
            <Text size={1.4} color="black1" weight={600}>
              총 예상 결제금액
            </Text>
            <Text size={1.6} color="black1" weight={700}>
              416,200원
            </Text>
          </Flex>
        </section>
        <Divider />
        <section className={styles.delivery_description_text}>
          {DELIVERY_DESCRIPTION_TEXT?.map((item) => (
            <Flex gap={6} key={item}>
              <Text size={1.3} color="black1">
                ㆍ
              </Text>
              <Text size={1.3} color="gray2">
                {item}
              </Text>
            </Flex>
          ))}
        </section>
        <Divider />
      </section>
    </article>
  );
};

export default CartPage;
