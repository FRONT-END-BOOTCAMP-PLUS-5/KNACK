import Text from '@/components/common/Text';
import styles from './searchBottomSheet.module.scss';

export default function SearchCategory() {
  return (
    <section className={`${styles.search_category} ${styles.contents_container}`}>
      <Text
        tag="h4"
        size={1.4}
        weight={600}
        className={styles.search_category_title}
        paddingLeft={16}
        paddingRight={16}
        marginBottom={12}
      >
        카테고리
      </Text>
    </section>
  );
}
