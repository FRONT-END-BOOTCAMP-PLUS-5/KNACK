'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './event.module.scss';

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
