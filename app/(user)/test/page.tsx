'use client';

import { cartService } from '@/services/cart';
import { CartRef } from '@/types/cart';

const TestPage = () => {
  const { addCart } = cartService;

  const handleAddCart = () => {
    const cartData: CartRef = {
      count: 1,
      optionMappingId: 1,
      productId: 3,
      userId: '7571e92b-f38b-4878-959c-f76ab9290ed8',
    };

    addCart(cartData)
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
