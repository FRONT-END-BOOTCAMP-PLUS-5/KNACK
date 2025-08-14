import BasicInput from '@/components/common/BasicInput';
import styles from './searchBottomSheet.module.scss';
import Image from 'next/image';
import check from '@/public/icons/check.svg';
import { IBrandWithTagList } from '@/types/brand';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { Fragment } from 'react';

interface IProps {
  selectedFilter: ISearchProductListRequest;
  brands: IBrandWithTagList[];
  onClickBrandSelect: (brandId: number) => void;
}

export default function SearchBrand({ selectedFilter, brands, onClickBrandSelect }: IProps) {
  const isBrandSelected = (listBrandId: number): boolean => {
    return selectedFilter.brandId?.includes(listBrandId) || false;
  };

  const handleBrandClick = (brandId: number) => {
    if (onClickBrandSelect) {
      onClickBrandSelect(brandId);
    }
  };

  return (
    <div className={styles.search_brand}>
      <div className={styles.search_brand_input_wrap}>
        <BasicInput placeholder="브랜드를 검색하세요" />
      </div>
      {brands &&
        brands.map((brand) => {
          return (
            <Fragment key={brand.tag}>
              <div className={styles.search_brand_list_wrap}>
                <div className={styles.search_brand_list_header}>{brand.tag}</div>
                <ul className={styles.search_brand_list}>
                  {brand.brandList.map((brand) => (
                    <li
                      className={styles.search_brand_list_item}
                      key={brand.id}
                      onClick={() => handleBrandClick(brand.id)}
                    >
                      <span>{brand.engName}</span>
                      {isBrandSelected(brand.id) && <Image src={check} alt="check" width={14} height={1} />}
                    </li>
                  ))}
                </ul>
              </div>
            </Fragment>
          );
        })}
    </div>
  );
}
