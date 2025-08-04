import styles from './searchModal.module.scss';

export default function SearchHeader() {
  return (
    <section className={styles.search_wrap}>
      <div className={styles.search_area}>
        <div className={styles.search}>
          <input
            className={styles.input_search}
            type="text"
            placeholder="브랜드, 상품, 프로필, 태그 등"
            title="검색창"
          />
          <button className={styles.btn_search_delete} style={{ display: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
              <circle cx="12" cy="12" r="10" fill="#F4F4F4" />
              <path
                fill="#222"
                fillOpacity=".8"
                fillRule="evenodd"
                d="m10.94 12-3.47 3.47 1.06 1.06L12 13.06l3.47 3.47 1.06-1.06L13.06 12l3.47-3.47-1.06-1.06L12 10.94 8.53 7.47 7.47 8.53 10.94 12z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <button className={styles.btn_close}>취소</button>
    </section>
  );
}
