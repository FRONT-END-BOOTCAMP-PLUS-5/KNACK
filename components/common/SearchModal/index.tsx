import styles from './searchModal.module.scss';
import SearchHeader from './SearchHeader';
import RecentKeywords from './RecentKeywords';
import RecommendedTags from './RecommendedTags';
import PopularKeywords from './PopularKeywords';
import RecentProducts from './RecentProducts';

export default function SearchModal() {
  return (
    <article className={styles.search_container}>
      <SearchHeader />

      <section className={styles.search_content_wrap}>
        <RecentKeywords />
        <RecommendedTags />
        <PopularKeywords />
        <RecentProducts />
      </section>
    </article>
  );
}
