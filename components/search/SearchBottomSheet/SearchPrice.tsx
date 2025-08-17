import Text from '@/components/common/Text';
import styles from './searchBottomSheet.module.scss';
import Flex from '@/components/common/Flex';
import Slider from '@mui/material/Slider';
import { useState, useEffect, useRef } from 'react';
import TagButton from '@/components/common/TagButton';
import { PRODUCT_FILTER_PRICE } from '@/constraint/product';
import { ISearchProductListRequest } from '@/types/searchProductList';
import { parseNumberRange } from '@/utils/search/numberRange';
import useDebounce from '@/hooks/useDebounce';

interface IProps {
  selectedFilter: ISearchProductListRequest;
  onClickPriceSelect: (price: string) => void;
  onChangePriceSelect: (newValue: number[]) => void;
}

export default function SearchPrice({ selectedFilter, onClickPriceSelect, onChangePriceSelect }: IProps) {
  const [value, setValue] = useState<number[]>([0, 10000000]);
  const debouncedValue = useDebounce(value, 300);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current && selectedFilter.price) {
      const { min, max } = parseNumberRange(selectedFilter.price);
      console.log('min, max : ', min, max);
      setValue([min || 0, max || 10000000]);
      isInitialized.current = true;
    }
  }, [selectedFilter.price]);

  useEffect(() => {
    onChangePriceSelect(debouncedValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleChange = (event: Event, newValue: number[]) => {
    setValue(newValue);
  };

  const formatValue = (value: number) => {
    const won = Math.floor(value / 10000);
    return `${won}만원`;
  };

  const handleClickPriceSelect = (price: string) => {
    const { min, max } = parseNumberRange(price);
    setValue([min || 0, max || 10000000]);
    onClickPriceSelect(price);
  };

  return (
    <article className={styles.search_price}>
      <div>
        <Flex justify="between" align="start" className={styles.search_price_title} paddingHorizontal={16}>
          <Text tag="h4" size={1.4} weight={600} marginBottom={12}>
            가격대
          </Text>
        </Flex>
        <Flex direction="row" gap={8} paddingHorizontal={16} className={styles.search_price_button_wrap}>
          {PRODUCT_FILTER_PRICE.map((item) => (
            <TagButton
              key={item.id}
              isActive={selectedFilter.price === item.value}
              onClick={() => handleClickPriceSelect(item.value)}
            >
              {item.name}
            </TagButton>
          ))}
        </Flex>
      </div>
      <div className={styles.search_price_slider_wrap}>
        <Flex
          justify="between"
          align="center"
          paddingHorizontal={14}
          paddingVertical={8}
          className={styles.slider_label_wrap}
        >
          <Text color="gray2">0만원</Text>
          <Text color="gray2">1000만원+</Text>
        </Flex>
        <Flex justify="center" align="center" paddingHorizontal={16} paddingVertical={8}>
          <Slider
            min={0}
            max={10000000}
            step={10000}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            valueLabelFormat={formatValue}
            sx={{
              color: 'black',
              width: 'calc(100% - 24px)',
              '& .MuiSlider-thumb': {
                backgroundColor: 'white',
                border: '1px solid #222',
                width: '24px',
                height: '24px',
                '&.Mui-active': {
                  boxShadow: 'none',
                },

                '&:hover, &.Mui-focusVisible': {
                  boxShadow: 'none',
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: '#333',
                height: '6px',
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#cecece',
                height: '6px',
              },
              '& .MuiSlider-valueLabelOpen': {
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '4px',
                padding: '2px 4px',
                backgroundColor: '#22222280',
                '&:before': {
                  display: 'none',
                },
              },
            }}
            className={styles.search_price_slider}
          />
        </Flex>
      </div>
    </article>
  );
}
