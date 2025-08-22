'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import BookMarkOn from '@/public/icons/book_mark_active.svg';
import styles from './categoryBrandModal.module.scss';
import { brandService } from '@/services/brand';
import { IBrandWithTagList } from '@/types/brand';
import DragScroll from '@/components/common/DragScroll';

export default function BrandTab() {
  const [brands, setBrands] = useState<IBrandWithTagList[]>([]);
  const [activeBrandTab, setActiveBrandTab] = useState<'ALL' | 'MY'>('ALL');
  const [activeTag, setActiveTag] = useState<string>('');
  const brandContainerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const brandGroupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const initBrands = async () => {
      try {
        const res = await brandService.getBrands();
        setBrands(res);
        if (res.length > 0) {
          setActiveTag(res[0].tag);
        }
      } catch (error) {
        console.error('브랜드 데이터 호출 실패 : ', error);
      }
    };

    initBrands();
  }, []);

  // 스크롤 감지하여 활성 태그 업데이트
  useEffect(() => {
    const handleScroll = () => {
      if (!brandContainerRef.current) return;

      const container = brandContainerRef.current;

      // 각 브랜드 그룹의 위치를 확인하여 현재 보이는 태그 찾기
      let currentActiveTag = '';

      Object.entries(brandGroupRefs.current).forEach(([tag, element]) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const elementTop = rect.top - containerRect.top;

        // 요소가 화면 상단에 가까우면 해당 태그를 활성화
        if (elementTop <= 100 && elementTop > -rect.height) {
          currentActiveTag = tag;
        }
      });

      if (currentActiveTag && currentActiveTag !== activeTag) {
        setActiveTag(currentActiveTag);
      }
    };

    const container = brandContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeTag, brands]);

  // 태그 클릭 시 해당 브랜드 그룹으로 스크롤
  const handleTagClick = useCallback((tag: string) => {
    const targetElement = brandGroupRefs.current[tag];
    if (targetElement && brandContainerRef.current) {
      const container = brandContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = targetElement.getBoundingClientRect();
      const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 20;

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });

      setActiveTag(tag);
    }
  }, []);

  // 활성 태그가 변경될 때 해당 태그로 자동 스크롤
  useEffect(() => {
    const activeTagElement = tagRefs.current[activeTag];
    if (activeTagElement) {
      activeTagElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTag]);

  return (
    <article className={styles.brand_container}>
      <section>
        <Flex justify="center" align="center" width="self" gap={70}>
          <div onClick={() => setActiveBrandTab('ALL')}>
            <Flex direction="column" width="self" gap={4} className={styles.brand_button_wrapper} align="center">
              <div className={`${styles.brand_button_image} ${activeBrandTab === 'ALL' ? styles.active : ''}`}>ALL</div>
              <Text
                color={activeBrandTab === 'ALL' ? 'black1' : 'lightGray1'}
                size={1.2}
                weight={activeBrandTab === 'ALL' ? 700 : 400}
              >
                전체 브랜드
              </Text>
            </Flex>
          </div>
          <div onClick={() => setActiveBrandTab('MY')}>
            <Flex direction="column" width="self" gap={4} align="center" className={styles.brand_button_wrapper}>
              <div className={`${styles.brand_button_image} ${activeBrandTab === 'MY' ? styles.active : ''}`}>
                <Image src={BookMarkOn} alt="관심 브랜드 아이콘" width={20} height={20} />
              </div>
              <Text
                color={activeBrandTab === 'MY' ? 'black1' : 'lightGray1'}
                size={1.2}
                weight={activeBrandTab === 'MY' ? 700 : 400}
              >
                관심 브랜드
              </Text>
            </Flex>
          </div>
        </Flex>
      </section>
      {activeBrandTab === 'ALL' && (
        <>
          <section className={styles.brand_tag_section}>
            {brands.length > 0 && (
              <DragScroll showScrollbar={false} className={styles.brand_tag_scroll}>
                <Flex gap={16} paddingHorizontal={16}>
                  {brands.map((brandGroup) => (
                    <div
                      key={brandGroup.tag}
                      ref={(el) => {
                        tagRefs.current[brandGroup.tag] = el;
                      }}
                      className={`${styles.brand_tag} ${activeTag === brandGroup.tag ? styles.active : ''}`}
                      onClick={() => handleTagClick(brandGroup.tag)}
                    >
                      <Text size={1.5} color={activeTag === brandGroup.tag ? 'black1' : 'gray5'}>
                        {brandGroup.tag}
                      </Text>
                    </div>
                  ))}
                </Flex>
              </DragScroll>
            )}
          </section>
          <div ref={brandContainerRef} className={styles.brand_list_container}>
            {brands.length > 0 &&
              brands.map((brandGroup) => (
                <div
                  key={brandGroup.tag}
                  ref={(el) => {
                    brandGroupRefs.current[brandGroup.tag] = el;
                  }}
                  className={styles.brand_group}
                >
                  {brandGroup.brandList.map((brand) => (
                    <section key={brand.id} className={styles.brand_item}>
                      <Flex justify="between" align="center">
                        <Flex gap={16} align="center">
                          <span className={styles.logo_image}>
                            <Image
                              src={`${STORAGE_PATHS?.PRODUCT?.LOGO}/${brand.logoImage}`}
                              alt="로고 이미지"
                              width={40}
                              height={40}
                            />
                          </span>
                          <Flex direction="column" width="self">
                            <Text size={1.5} weight={700}>
                              {brand.engName}
                            </Text>
                            <Text size={1.2} color="gray2" marginTop={4}>
                              {brand.korName}ㆍ관심 {brand.likesCount}
                            </Text>
                          </Flex>
                        </Flex>
                        <button className={styles.book_mark_button}>
                          <Image src={BookMarkOn} alt="좋아요 아이콘" width={20} height={20} />
                        </button>
                      </Flex>
                    </section>
                  ))}
                </div>
              ))}
          </div>
        </>
      )}
      {activeBrandTab === 'MY' && (
        <div>
          <Text>관심 브랜드</Text>
        </div>
      )}
    </article>
  );
}
