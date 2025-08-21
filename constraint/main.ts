import { TEXT_COLOR } from '@/components/common/Text';
import mainBanner01 from '@/public/images/main_banner01.jpg';
import mainBanner02 from '@/public/images/main_banner02.jpg';
import mainBanner03 from '@/public/images/main_banner03.jpg';
import mainBanner04 from '@/public/images/main_banner04.png';
import mainBanner05 from '@/public/images/main_banner05.jpg';
import middleBanner01 from '@/public/images/middle_banner01.jpg';
import middleBanner02 from '@/public/images/middle_banner02.jpg';
import middleBanner03 from '@/public/images/middle_banner03.jpg';
import { StaticImageData } from 'next/image';

interface ISlideImage {
  src: StaticImageData;
  mainText: string;
  subText: string;
  textColor: keyof typeof TEXT_COLOR;
}

export const SLIDES_IMAGE: ISlideImage[] = [
  {
    src: mainBanner01,
    mainText: 'TOP 100 TRENDING Items',
    subText: '지금 그의 위시 리스트!',
    textColor: 'black1',
  },
  {
    src: mainBanner02,
    mainText: 'Porter X Cecilie Bahnsen',
    subText: '드디어 발매된 국내의 이 조합!',
    textColor: 'black1',
  },
  {
    src: mainBanner03,
    mainText: '다가오는 개강을 위한 캠퍼스 코디 추천',
    subText: '~50% 할인 | 10% 쿠폰',
    textColor: 'white',
  },
  {
    src: mainBanner04,
    mainText: '이번주 급상승 브랜드',
    subText: '남들보다 빠르게 확인하는 하입 브랜드',
    textColor: 'white',
  },
  {
    src: mainBanner05,
    mainText: '귀여운 것들 총집합 케릭터 컬렉터블',
    subText: '~30% 할인 | 15% 쿠폰',
    textColor: 'black1',
  },
];

export const MIDDLE_BANNER_SLIDE = [
  {
    src: middleBanner01,
    mainText: '최대 2만5천원 즉시할인',
    subText: '토스페이 x 삼성카드 결제 시',
  },
  {
    src: middleBanner02,
    mainText: '최대 3만원 즉시할인',
    subText: '카카오페이 머니 결제 시',
  },
  {
    src: middleBanner03,
    mainText: 'BC카드 3% 청구할인',
    subText: '20만원 이상 결제 시',
  },
];
