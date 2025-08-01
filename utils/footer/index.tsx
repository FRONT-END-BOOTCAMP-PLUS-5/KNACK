import React from 'react';
import { TabItem } from '@/types/footer';

export const createTabIcon = (id: string) => {
  const icons = {
    HOME: {
      defaultIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      activeIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
          <rect x="9.5" y="15" width="5" height="5" fill="white"/>
        </svg>
      )
    },
    SHOP: {
      defaultIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
          <line x1="3" y1="7" x2="9" y2="7"/>
          <line x1="3" y1="12" x2="9" y2="12"/>
          <line x1="3" y1="17" x2="9" y2="17"/>
          <circle cx="16" cy="12" r="5"/>
          <path d="M19.5 15.5L23 19"/>
        </svg>
      ),
      activeIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="7" x2="9" y2="7"/>
          <line x1="3" y1="12" x2="9" y2="12"/>
          <line x1="3" y1="17" x2="9" y2="17"/>
          <circle cx="16" cy="12" r="5"/>
          <path d="M19.5 15.5L23 19"/>
        </svg>
      )
    },
    SAVED: {
      defaultIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      activeIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    MY: {
      defaultIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      activeIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  };

  return icons[id as keyof typeof icons] || icons.HOME;
};

export const getFooterTabs = (): TabItem[] => {
  return [
    {
      id: 'HOME',
      label: 'HOME',
      ...createTabIcon('HOME')
    },
    {
      id: 'SHOP',
      label: 'SHOP',
      ...createTabIcon('SHOP')
    },
    {
      id: 'SAVED',
      label: 'SAVED',
      ...createTabIcon('SAVED')
    },
    {
      id: 'MY',
      label: 'MY',
      ...createTabIcon('MY')
    }
  ];
}; 