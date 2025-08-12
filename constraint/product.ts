export const PRODUCT_FILTER = [
  { id: 1, name: '카테고리', value: 'categoryId' },
  { id: 2, name: '성별', value: 'gender' },
  { id: 3, name: '색상', value: 'keywordColorId' },
  { id: 4, name: '혜택/할인', value: 'discount' },
  { id: 5, name: '브랜드', value: 'brandId' },
  { id: 6, name: '사이즈', value: 'size' },
  { id: 7, name: '가격대', value: 'price' },
] as const;

export const PRODUCT_FILTER_SORT = [
  { id: 1, name: '최신순', value: 'latest' },
  { id: 2, name: '인기순', value: 'popular' },
  { id: 3, name: '가격 높은순', value: 'price_high' },
  { id: 4, name: '가격 낮은순', value: 'price_low' },
  { id: 5, name: '관심 많은순', value: 'likes' },
  { id: 6, name: '리뷰 많은순', value: 'reviews' },
] as const;

export const PRODUCT_FILTER_COLOR = [
  { id: 13, engName: 'black', korName: '블랙', color: '#000', image: '' },
  { id: 14, engName: 'gray', korName: '그레이', color: '#ccc', image: '' },
  { id: 15, engName: 'white', korName: '화이트', color: '#fff', image: '' },
  { id: 16, engName: 'ivory', korName: '아이보리', color: '#f4eedd', image: '' },
  { id: 17, engName: 'beige', korName: '베이지', color: '#e6c281', image: '' },
  { id: 18, engName: 'brown', korName: '브라운', color: '#663203', image: '' },
  { id: 19, engName: 'khaki', korName: '카키', color: '#8f784b', image: '' },
  { id: 20, engName: 'green', korName: '그린', color: '#008000', image: '' },
  { id: 21, engName: 'light green', korName: '라이트그린', color: '#90ee90', image: '' },
  { id: 22, engName: 'mint', korName: '민트', color: '#72d5c0', image: '' },
  { id: 23, engName: 'navy', korName: '네이비', color: '#000080', image: '' },
  { id: 24, engName: 'blue', korName: '블루', color: '#3032f3', image: '' },
  { id: 25, engName: 'sky blue', korName: '스카이블루', color: '#87ceeb', image: '' },
  { id: 26, engName: 'purple', korName: '퍼플', color: '#800080', image: '' },
  { id: 27, engName: 'pink', korName: '핑크', color: '#ffc0cb', image: '' },
  { id: 28, engName: 'red', korName: '레드', color: '#ff0000', image: '' },
  { id: 29, engName: 'orange', korName: '오렌지', color: '#ffa500', image: '' },
  { id: 30, engName: 'yellow', korName: '옐로우', color: '#ffff00', image: '' },
  { id: 31, engName: 'silver', korName: '실버', color: '', image: '/images/filter_silver.png' },
  { id: 32, engName: 'gold', korName: '골드', color: '', image: '/images/filter_gold.png' },
  { id: 33, engName: 'mix', korName: '믹스', color: '', image: '/images/filter_mix.png' },
] as const;

export const PRODUCT_FILTER_GENDER = [
  { id: 1, name: '남성', value: 'm' },
  { id: 2, name: '여성', value: 'f' },
  { id: 3, name: '공용', value: 'all' },
] as const;

export const PRODUCT_FILTER_DISCOUNT = [
  { id: 1, name: '30% 이하', value: '-30' },
  { id: 2, name: '30%-50%', value: '30-50' },
  { id: 3, name: '50% 이상', value: '50-' },
] as const;

export const PRODUCT_FILTER_PRICE = [
  { id: 1, name: '10만원 이하', value: '0-99999' },
  { id: 2, name: '10만원대', value: '100000-199999' },
  { id: 3, name: '20만원대', value: '200000-299999' },
  { id: 4, name: '30만원대', value: '300000-399999' },
  { id: 5, name: '30-50만원', value: '300000-500000' },
  { id: 6, name: '50-100만원', value: '500000-1000000' },
  { id: 7, name: '100-500만원', value: '1000000-5000000' },
  { id: 8, name: '500만원 이상', value: '5000000-' },
] as const;
