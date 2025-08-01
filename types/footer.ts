import React from 'react';

export type TabId = 'HOME' | 'SHOP' | 'SAVED' | 'MY';

export interface TabItem {
  id: TabId;
  label: string;
  defaultIcon: React.ReactNode;
  activeIcon: React.ReactNode;
} 