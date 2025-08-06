'use client';

import { cartService } from '@/services/cart';
import { CartRef } from '@/types/cart';

const TestPage = () => {
  const { upsertCart } = cartService;

  const handleAddCart = () => {
    const cartData: CartRef = {
      count: 1,
      optionValueId: 2,
      productId: 1,
      userId: '7571e92b-f38b-4878-959c-f76ab9290ed8',
      id: 0,
    };

    upsertCart(cartData)
      .then((res) => {
        console.log('res', res);
      })
      .catch((error) => {
        console.log('error', error.message);
      });
  };

  return (
    <div>
      테스트 <br />
      <button onClick={handleAddCart}>장바구니 추가 </button>
    </div>
  );
};

export default TestPage;
