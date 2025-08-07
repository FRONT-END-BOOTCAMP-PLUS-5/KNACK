import Text from '@/components/common/Text';
import styles from './textReview.module.scss';
import Flex from '@/components/common/Flex';
import Button from '@/components/common/Button';

interface IProps {
  reviewProgress?: { id: number; percent: string; rating: number }[];
  reviewTextData?: { id: number; normal: string; bold: string; percent: string }[];
}

const TextReview = ({ reviewProgress, reviewTextData }: IProps) => {
  return (
    <section className={styles.review_container}>
      <Text tag="h2" size={1.7} weight={600} paddingTop={24} paddingBottom={16}>
        일반 리뷰 51
      </Text>
      <Flex gap={32}>
        <Text size={4} weight={700}>
          4.7
          <Text tag="span">★</Text>
        </Text>
        <Flex direction="column">
          {reviewProgress?.map((item) => (
            <Flex align="center" gap={8} key={item?.id} marginVertical={4}>
              <div className={styles.review_progress_bar}>
                <div className={styles.progress} style={{ width: item.percent }} />
              </div>

              <Text className={styles.progress_rating} size={1.1} color="gray5">
                {item?.rating}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" className={styles.review_result_text_wrap}>
        {reviewTextData?.map((item) => (
          <Flex gap={8} key={item?.id} paddingVertical={6}>
            <Text tag="p" className={styles.result_title} size={1.4}>
              {item?.normal}
              <Text tag="span" size={1.4} weight={600}>
                {item?.bold}
              </Text>
            </Text>
            <Text size={1.4} weight={600}>
              {item?.percent}
            </Text>
          </Flex>
        ))}
      </Flex>
      <Button text="리뷰 더보기" size="large" style="border" />
    </section>
  );
};

export default TextReview;
