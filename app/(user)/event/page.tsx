import Image from 'next/image';
import Link from 'next/link';
import styles from './event.module.scss';
import { Metadata } from 'next';
import { createMetaData } from '@/utils/createMetaData';

export const metadata: Metadata = createMetaData({
  title: 'EVENT | KNACK',
  description: 'KNACK의 다양한 이벤트, 할인 정보를 확인해보세요.',
});

export default function EventPage() {
  return (
    <div className={styles.event_container}>
      <div className={styles.event_content}>
        <Link href="/event/fishhook" className={styles.event_link}>
          <Image src="/images/event/event_banner.png" alt="이벤트 내용" width={400} height={300} />
        </Link>
      </div>
    </div>
  );
}
