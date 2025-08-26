import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './productCard.module.scss';
import bookmark from '@/public/icons/book_mark.svg';
import bookmarkActive from '@/public/icons/book_mark_active.svg';
import { STORAGE_PATHS } from '@/constraint/auth';
import { ISearchProductList } from '@/types/searchProductList';
import { useToggleProductLike } from '@/hooks/search/useToggleProductLike';
import LikeToast from '@/components/products/LikeToast';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

const TOAST_MESSAGE = {
  ADD: '관심 상품에 저장되었어요!',
  REMOVE: '관심 상품에서 삭제했어요',
};

const ProductCardLarge = ({ product }: { product: ISearchProductList }) => {
  const { mutate: toggleProductLike, isPending, isSuccess } = useToggleProductLike();
  const [showToast, setShowToast] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleToggleProductLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    toggleProductLike({ isLiked: product.isLiked, id: product.id });
  };

  return (
    <>
      <LikeToast
        open={showToast}
        setOpen={() => setShowToast(false)}
        message={product.isLiked ? TOAST_MESSAGE.ADD : TOAST_MESSAGE.REMOVE}
        link={product.isLiked ? '/saved?tab=product' : undefined}
      />
      <Link href={`/products/${product.id}`} className={styles.product_card_large}>
        <figure className={styles.thumbnail}>
          <div className={styles.image_container}>
            <Image
              src={`${STORAGE_PATHS.PRODUCT.THUMBNAIL}/${product.thumbnailImage}`}
              alt="상품이미지"
              fill
              sizes="100"
              className={styles.product_image}
            />
          </div>
          <div className={styles.product_bookmark}>
            {product.isLiked ? (
              <button
                className={styles.bookmark_button}
                type="button"
                onClick={(e) => handleToggleProductLike(e)}
                disabled={isPending}
              >
                <Image src={bookmarkActive} alt="관심" width={24} height={24} />
              </button>
            ) : (
              <button
                className={styles.bookmark_button}
                type="button"
                onClick={(e) => handleToggleProductLike(e)}
                disabled={isPending}
              >
                <Image src={bookmark} alt="관심" width={24} height={24} />
              </button>
            )}
          </div>
        </figure>

        <figcaption className={styles.product_info}>
          <div className={styles.brand_name}>
            <p>{product.brand.engName}</p>
          </div>
          <div className={styles.product_name}>
            <p>{product.engName}</p>
          </div>
          <div className={styles.product_name_sub}>
            <p>{product.korName}</p>
          </div>
          {product.isSoldOut && (
            <div className={styles.product_sold_out}>
              <span>품절</span>
            </div>
          )}

          <div className={styles.price_info}>
            <div className={styles.price}>
              <p>{product.price.toLocaleString()}원</p>
            </div>
          </div>

          <div className={styles.interest_info}>
            <p>
              관심 <span>{product.likesCount}</span>
              <span> • </span>
              리뷰 <span>{product.reviewsCount}</span>
            </p>
          </div>
        </figcaption>
      </Link>
    </>
  );
};

export { ProductCardLarge };
