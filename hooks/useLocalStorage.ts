import { useState } from 'react';

export const useLocalStorage = () => {
  const [recentKeywords, setRecentKeywords] = useState<string[]>(() => {
    const storage = localStorage.getItem('keyword');
    return storage ? JSON.parse(storage) : [];
  });

  const addStorage = (keyword: string) => {
    const updateKeywords = [keyword, ...recentKeywords.filter((item: string) => item !== keyword).slice(0, 10)];
    setRecentKeywords(updateKeywords);
    localStorage.setItem('keyword', JSON.stringify(updateKeywords));
  };

  const deleteStorage = (keyword: string) => {
    const updateKeywords = recentKeywords.filter((item: string) => item !== keyword);
    setRecentKeywords(updateKeywords);
    localStorage.setItem('keyword', JSON.stringify(updateKeywords));
  };

  const deleteAllStorage = () => {
    localStorage.removeItem('keyword');
    setRecentKeywords([]);
  };

  return { recentKeywords, addStorage, deleteStorage, deleteAllStorage };
};
