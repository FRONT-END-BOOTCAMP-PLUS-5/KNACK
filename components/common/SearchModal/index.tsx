'use client';

import styles from './searchModal.module.scss';
import SearchHeader from './SearchHeader';
import RecentKeywords from './RecentKeywords';
import RecommendedTags from './RecommendedTags';
import RecentProducts from './RecentProducts';

interface IProps {
  handleSearchInputClick: (state: boolean) => void;
}

export default function SearchModal({ handleSearchInputClick }: IProps) {
  return (
    <article className={styles.search_container}>
      <SearchHeader handleSearchInputClick={handleSearchInputClick} />

      <section className={styles.search_content_wrap}>
        <RecentKeywords handleSearchInputClick={handleSearchInputClick} />
        <RecommendedTags handleSearchInputClick={handleSearchInputClick} />
        {/* <PopularKeywords /> */}
        <RecentProducts handleSearchInputClick={handleSearchInputClick} />
      </section>
    </article>
  );
}
