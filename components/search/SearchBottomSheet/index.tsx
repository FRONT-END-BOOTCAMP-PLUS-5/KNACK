'use client';
import styles from './search_bottom_sheet.module.scss';
import BottomSheet from '@/components/common/BottomSheet';
import { PRODUCT_FILTER } from '@/constraint/product';
import DragScroll from '@/components/common/DragScroll';

export default function SearchBottomSheet() {
  return (
    <div>
      <BottomSheet>
        <section className={styles.tab_menu_container}>
          <DragScroll className={styles.tab_menu_scroll} showScrollbar={false}>
            <ul className={styles.tab_menu_list}>
              {PRODUCT_FILTER.map((item) => (
                <li className={styles.tab_menu_item} key={item.id}>
                  {item.name}
                </li>
              ))}
            </ul>
          </DragScroll>
        </section>
      </BottomSheet>
    </div>
  );
}
