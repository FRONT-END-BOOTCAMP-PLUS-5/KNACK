import React from 'react';
import { TabItem } from '@/types/footer';
import Image from 'next/image';
import homeIcon from '@/public/icons/home.svg';
import homeActiveIcon from '@/public/icons/home_active.svg';
import searchIcon from '@/public/icons/search.svg';
import searchActiveIcon from '@/public/icons/search_active.svg';
import savedIcon from '@/public/icons/book_mark.svg';
import savedActiveIcon from '@/public/icons/book_mark_active.svg';
import myIcon from '@/public/icons/my.svg';
import myActiveIcon from '@/public/icons/my_active.svg';

export const createTabIcon = (id: string) => {
  const icons = {
    HOME: {
      defaultIcon: <Image src={homeIcon} alt="home" width={24} height={24} />,
      activeIcon: <Image src={homeActiveIcon} alt="home" width={24} height={24} />,
    },
    SHOP: {
      defaultIcon: <Image src={searchIcon} alt="search" width={24} height={24} />,
      activeIcon: <Image src={searchActiveIcon} alt="search" width={24} height={24} />,
    },
    SAVED: {
      defaultIcon: <Image src={savedIcon} alt="saved" width={24} height={24} />,
      activeIcon: <Image src={savedActiveIcon} alt="saved" width={24} height={24} />,
    },
    MY: {
      defaultIcon: <Image src={myIcon} alt="my" width={24} height={24} />,
      activeIcon: <Image src={myActiveIcon} alt="my" width={24} height={24} />,
    },
  };

  return icons[id as keyof typeof icons] || icons.HOME;
};

export const getFooterTabs = (): TabItem[] => {
  return [
    {
      id: 'HOME',
      label: 'HOME',
      ...createTabIcon('HOME'),
    },
    {
      id: 'SHOP',
      label: 'SHOP',
      ...createTabIcon('SHOP'),
    },
    {
      id: 'SAVED',
      label: 'SAVED',
      ...createTabIcon('SAVED'),
    },
    {
      id: 'MY',
      label: 'MY',
      ...createTabIcon('MY'),
    },
  ];
};
