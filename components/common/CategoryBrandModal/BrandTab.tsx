'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Flex from '@/components/common/Flex';
import Text from '@/components/common/Text';
import Image from 'next/image';
import { STORAGE_PATHS } from '@/constraint/auth';
import BookMark from '@/public/icons/book_mark.svg';
import BookMarkOn from '@/public/icons/book_mark_active.svg';
import styles from './categoryBrandModal.module.scss';
import { brandService } from '@/services/brand';
import { IBrandWithTagList } from '@/types/brand';
import DragScroll from '@/components/common/DragScroll';
import BrandMy from './BrandMy';
import Link from 'next/link';

export default function BrandTab() {
  const [brands, setBrands] = useState<IBrandWithTagList[]>([]);
  const [activeBrandTab, setActiveBrandTab] = useState<'ALL' | 'MY'>('ALL');
  const [activeTag, setActiveTag] = useState<string>('');
  const brandContainerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const brandGroupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleTabChange = (tab: 'ALL' | 'MY') => {
    setActiveBrandTab(tab);
    if (tab === 'ALL' && brands.length > 0) {
      setActiveTag(brands[0].tag);
    }
  };

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && activeBrandTab === 'ALL') {
            const tag = entry.target.getAttribute('data-brand-tag') || '';
            setActiveTag(tag);
          }
        });
      },
      {
        root: brandContainerRef.current,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    Object.values(brandGroupRefs.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [brands, activeBrandTab]);

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
          <div onClick={() => handleTabChange('ALL')}>
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
          <div onClick={() => handleTabChange('MY')}>
            <Flex direction="column" width="self" gap={4} align="center" className={styles.brand_button_wrapper}>
              <div className={`${styles.brand_button_image} ${activeBrandTab === 'MY' ? styles.active : ''}`}>
                <Image src={BookMarkOn} alt="관심 브랜드 아이콘" width={24} height={24} />
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
                  data-brand-tag={brandGroup.tag}
                  ref={(el) => {
                    brandGroupRefs.current[brandGroup.tag] = el;
                  }}
                  className={styles.brand_group}
                >
                  {brandGroup.brandList.map((brand) => (
                    <Link key={brand.id} className={styles.brand_item} href={`/search?keyword=${brand.korName}`}>
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
                          <Image src={BookMark} alt="좋아요 아이콘" width={20} height={20} />
                        </button>
                      </Flex>
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </>
      )}
      {activeBrandTab === 'MY' && <BrandMy />}
    </article>
  );
}
