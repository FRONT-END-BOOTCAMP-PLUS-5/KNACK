'use client';

import styles from './searchModal.module.scss';
import BasicInput from '../BasicInput';

export default function SearchHeader() {
  return (
    <section className={styles.search_wrap}>
      <BasicInput placeholder="브랜드, 상품, 프로필, 태그 등" />
      <button className={styles.btn_close}>취소</button>
    </section>
  );
}
