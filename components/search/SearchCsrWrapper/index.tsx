'use client';

import { useBottomSheetStore } from '@/store/bottomSheetStore';
import SearchBottomSheet from '../SearchBottomSheet';
import SearchFilter from '../SearchFilter';
import SearchSort from '../SearchSort';
import { useState } from 'react';

export default function SearchCsrWrapper() {
  const [select, setSelect] = useState(0);
  const { onOpen } = useBottomSheetStore();

  const handleSelect = (id: number, isOpen: boolean) => {
    setSelect(id);
    if (isOpen) {
      onOpen();
    }
  };

  return (
    <>
      <SearchFilter handleSelect={handleSelect} />
      <SearchSort />
      <SearchBottomSheet select={select} handleSelect={handleSelect} />
    </>
  );
}
