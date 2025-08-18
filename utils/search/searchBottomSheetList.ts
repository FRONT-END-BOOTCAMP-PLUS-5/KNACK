import { ISearchProductListRequest } from '@/types/searchProductList';
import { IPageCategory } from '@/types/category';
import { IBrandWithTagList } from '@/types/brand';
import { IOption } from '@/types/option';
import {
  PRODUCT_FILTER_COLOR,
  PRODUCT_FILTER_GENDER,
  PRODUCT_FILTER_DISCOUNT,
  PRODUCT_FILTER_PRICE,
  FilterValueType,
} from '@/constraint/product';

interface ISelectedBottomList {
  type: FilterValueType;
  name: string;
  value: string | number;
}

interface FilterData {
  categories: IPageCategory[];
  brands: IBrandWithTagList[];
  sizes: IOption[];
}

export const convertFilterToBottomList = (
  filterQuery: ISearchProductListRequest,
  data: FilterData
): ISelectedBottomList[] => {
  const result: ISelectedBottomList[] = [];

  // 서브카테고리
  if (filterQuery.subCategoryId?.length) {
    filterQuery.subCategoryId.forEach((subCategoryId) => {
      const category = data.categories
        .flatMap((cat) => cat.subCategories || [])
        .find((subCat) => subCat.id === subCategoryId);

      if (category) {
        result.push({
          type: 'subCategoryId',
          name: category.korName,
          value: subCategoryId,
        });
      }
    });
  }

  // 브랜드
  if (filterQuery.brandId?.length) {
    filterQuery.brandId.forEach((brandId) => {
      const brand = data.brands.flatMap((brandGroup) => brandGroup.brandList).find((brand) => brand.id === brandId);
      if (brand) {
        result.push({
          type: 'brandId',
          name: brand.korName,
          value: brandId,
        });
      }
    });
  }

  // 사이즈
  if (filterQuery.size?.length) {
    filterQuery.size.forEach((size) => {
      const sizeOption = data.sizes
        .flatMap((option) => option.optionValues)
        .find((optionValue) => optionValue.name === size);
      if (sizeOption) {
        result.push({
          type: 'size',
          name: sizeOption.name,
          value: size,
        });
      }
    });
  }

  // 색상
  if (filterQuery.keywordColorId?.length) {
    filterQuery.keywordColorId.forEach((colorId) => {
      const color = PRODUCT_FILTER_COLOR.find((colorItem) => colorItem.id === colorId);
      if (color) {
        result.push({
          type: 'keywordColorId',
          name: color.korName,
          value: colorId,
        });
      }
    });
  }

  // 성별
  if (filterQuery.gender) {
    const gender = PRODUCT_FILTER_GENDER.find((genderItem) => genderItem.value === filterQuery.gender);
    if (gender) {
      result.push({
        type: 'gender',
        name: gender.name,
        value: filterQuery.gender,
      });
    }
  }

  // 할인
  if (filterQuery.discount) {
    const discount = PRODUCT_FILTER_DISCOUNT.find((discountItem) => discountItem.value === filterQuery.discount);
    if (discount) {
      result.push({
        type: 'discount',
        name: discount.name,
        value: filterQuery.discount,
      });
    }
  }

  // 가격
  if (filterQuery.price) {
    const price = PRODUCT_FILTER_PRICE.find((priceItem) => priceItem.value === filterQuery.price);
    if (price) {
      result.push({
        type: 'price',
        name: price.name,
        value: filterQuery.price,
      });
    } else {
      // 커스텀 가격 범위인 경우
      const isValidPriceRange = (priceRange: string): boolean => {
        // "숫자-숫자"
        const pricePattern = /^\d+-\d+$/;
        if (!pricePattern.test(priceRange)) {
          return false;
        }

        const [min, max] = priceRange.split('-').map(Number);
        return !isNaN(min) && !isNaN(max) && min >= 0 && max >= 0 && min <= max;
      };

      const formatCustomPriceRange = (priceRange: string): string => {
        const [min, max] = priceRange.split('-').map(Number);
        const formatPrice = (price: number): string => {
          if (price >= 10000) {
            return `${Math.floor(price / 10000)}만원`;
          }
          return `${price.toLocaleString()}원`;
        };
        return `${formatPrice(min)}-${formatPrice(max)}`;
      };

      if (isValidPriceRange(filterQuery.price)) {
        result.push({
          type: 'price',
          name: formatCustomPriceRange(filterQuery.price),
          value: filterQuery.price,
        });
      }
    }
  }

  return result;
};
