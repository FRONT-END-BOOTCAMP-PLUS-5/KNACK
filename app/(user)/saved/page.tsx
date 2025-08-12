'use client';

import { likeService } from '@/services/like';
import styles from './saved.module.scss';
import { useCallback, useEffect } from 'react';

const SavedPage = () => {
  const { addLike } = likeService;

  const handleLikeAdd = useCallback(() => {
    const data = {
      userId: 'd232a840-098f-4e9a-bf51-b6605e59be0d',
      productId: 5,
      optionValueId: 2,
    };

    addLike(data)
      .then((res) => {
        console.log('res', res);
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [addLike]);

  useEffect(() => {
    handleLikeAdd();
  }, [handleLikeAdd]);

  return <div>저장하기</div>;
};

export default SavedPage;
