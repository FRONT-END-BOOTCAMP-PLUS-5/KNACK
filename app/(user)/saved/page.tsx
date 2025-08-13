'use client';

import { likeService } from '@/services/like';
import { useCallback } from 'react';

const SavedPage = () => {
  const { addLike, deleteLike, getLikes } = likeService;

  const handleLikeAdd = useCallback(() => {
    const data = {
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

  const handleDeleteLike = useCallback(() => {
    const likeId = 1;

    deleteLike(likeId)
      .then((res) => {
        console.log('res', res);
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [deleteLike]);

  const handleGetLikes = useCallback(() => {
    const ids = ['1', '2'];
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('id', id));

    getLikes(params.toString())
      .then((res) => {
        console.log('res', res);
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  }, [getLikes]);

  return (
    <div>
      <button onClick={handleLikeAdd}>저장하기</button>
      <button onClick={handleDeleteLike}>삭제하기</button>
      <button onClick={handleGetLikes}>가져오기</button>
    </div>
  );
};

export default SavedPage;
