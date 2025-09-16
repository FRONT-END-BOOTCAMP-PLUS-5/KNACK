import Image from 'next/image';
import Link from 'next/link';
import styles from './event.module.scss';
import { Metadata } from 'next';
import { createMetaData } from '@/utils/createMetaData';
import Text from '@/components/common/Text';

export const metadata: Metadata = createMetaData({
  title: 'EVENT | KNACK',
  description: 'KNACK의 다양한 이벤트, 할인 정보를 확인해보세요.',
});

export default function EventPage() {
  return (
    <div className={styles.event_container}>
      <div className={styles.event_content}>
        <Link href="/event/fishhook" className={styles.event_link}>
          <figure>
            <div className={styles.event_image_box}>
              <Image
                src="/images/event/event_banner2.png"
                alt="이벤트 배너"
                fill
                quality={100}
                className={styles.event_image}
              />
            </div>
            <figcaption className={styles.event_image_caption}>
              <Text tag="h3" size={1.6} weight={700} marginTop={18}>
                낚시하고 랜덤 포인트 받기
              </Text>
              <Text tag="p" size={1.3} color="gray1" marginTop={4}>
                랜덤 포인트 최대 1,000P
              </Text>
            </figcaption>
          </figure>
        </Link>
      </div>
    </div>
  );
}
