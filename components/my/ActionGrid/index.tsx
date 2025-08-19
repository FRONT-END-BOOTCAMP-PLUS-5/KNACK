import styles from './actionGrid.module.scss';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Image from 'next/image';
import Link from 'next/link';
import { useReviewCount } from '@/hooks/useReviewCount';

import PointIcon from '@/public/icons/my_point.png';
import ReviewIcon from '@/public/icons/my_review.png';
import CouponIcon from '@/public/icons/my_coupon.png';

const ActionGrid = () => {
  const { reviewCount } = useReviewCount();

  return (
    <article className={styles.grid_box}>
      <Flex direction="column" align="center" gap={8} paddingVertical={16}>
        <Image src={PointIcon} alt="포인트" width={28} height={28} />
        <Text size={1.2}>{0}P</Text>
      </Flex>
      <Flex direction="column" align="center" gap={8} paddingVertical={16}>
        <Image src={CouponIcon} alt="쿠폰" width={28} height={28} />
        <Text size={1.2}>쿠폰 {0}</Text>
      </Flex>
      <Flex direction="column" align="center" gap={8} paddingVertical={16}>
        <Link href="/my/review" className={styles.review_link}>
          <Image src={ReviewIcon} alt="리뷰" width={28} height={28} />
          {/* reviewCount가 null이면 빈 문자열, 숫자가 있으면 숫자 표시 */}
          <Text size={1.2}>리뷰 {reviewCount ?? ''}</Text>
        </Link>
      </Flex>
    </article>
  );
};

export default ActionGrid;
