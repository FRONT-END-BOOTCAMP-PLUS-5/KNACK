'use client';
import Image from 'next/image';
import closeIcon from '@/public/icons/close.svg';
import styles from './searchModal.module.scss';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface IProps {
  handleSearchInputClick: (state: boolean) => void;
}

export default function RecentKeywords({ handleSearchInputClick }: IProps) {
  const { recentKeywords, addStorage, deleteStorage, deleteAllStorage } = useLocalStorage();
  const router = useRouter();

  const handleKeywordClick = (keyword: string) => {
    addStorage(keyword);
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
    handleSearchInputClick(false);
  };

  const handleDeleteKeyword = (event: React.MouseEvent<HTMLImageElement>, keyword: string) => {
    event.stopPropagation();
    deleteStorage(keyword);
  };

  return (
    <section className={styles.search_card_items}>
      {recentKeywords.length > 0 && (
        <div className={styles.layer_search_item}>
          <div className={styles.layer_search_title_wrap}>
            <h4 className={styles.title}>최근 검색어</h4>
            <div className={styles.title_sub_text}>
              <button className={styles.color_black} type="button" onClick={deleteAllStorage}>
                지우기
              </button>
            </div>
          </div>
          <div className={styles.layer_search_item_content_wrap}>
            <div className={styles.recent_box}>
              <div className={styles.search_list}>
                {recentKeywords.map((keyword, index) => (
                  <div
                    key={'recent-keyword-' + index}
                    className={styles.search_item}
                    onClick={() => handleKeywordClick(keyword)}
                  >
                    <div className={styles.search_item_text}>{keyword}</div>
                    <Image
                      src={closeIcon}
                      alt="close"
                      width={24}
                      height={24}
                      onClick={(event) => handleDeleteKeyword(event, keyword)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
