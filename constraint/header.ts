export const HEADER_TABS = ['추천', '신상', '신발', '랭킹', '럭셔리', '이벤트'] as const;

export const DEFAULT_ACTIVE_TAB = '추천';

export type HeaderTab = (typeof HEADER_TABS)[number];

export const CATEGORY_ALL_TAB = {
  id: 0,
  name: '전체',
  subCategories: [
    { id: 0, name: '인기 백팩', url: '/search?keyword=백팩&sort=popular', image: '/images/popular_bag.webp' },
    { id: 1, name: '인기 티셔츠', url: '/search?keyword=티셔츠&sort=popular', image: '/images/popular_tshirt.webp' },
    { id: 2, name: '인기 모자', url: '/search?keyword=모자&sort=popular', image: '/images/popular_hat.webp' },
    {
      id: 3,
      name: '인기 숏팬츠',
      url: '/search?keyword=숏팬츠&sort=popular',
      image: '/images/popular_pants.webp',
    },
    { id: 4, name: '인기 후드', url: '/search?keyword=후드&sort=popular', image: '/images/popular_hoodie.webp' },
    { id: 5, name: '인기 신발', url: '/search?keyword=신발&sort=popular', image: '/images/popular_shoes.webp' },
    {
      id: 6,
      name: '긴소매 티셔츠',
      url: '/search?keyword=긴소매티셔츠&sort=popular',
      image: '/images/popular_long_sleeve.webp',
    },
    {
      id: 7,
      name: '바람막이',
      url: '/search?keyword=바람막이&sort=popular',
      image: '/images/popular_windbreaker.webp',
    },
    { id: 8, name: '아디다스', url: '/search?keyword=아디다스&sort=popular', image: '/images/popular_adidas.webp' },
    { id: 9, name: '나이키', url: '/search?keyword=나이키&sort=popular', image: '/images/popular_nike.webp' },
  ],
};
