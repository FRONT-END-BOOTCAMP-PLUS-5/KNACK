'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './fishhook.module.scss';
import { pointsService } from '@/services/points';

export default function FishHookPage() {
  const [isVisible, setIsVisible] = useState(true); // 기본적으로 보이도록 설정
  const [bg1Active, setBg1Active] = useState(false);
  const [bg2Active, setBg2Active] = useState(false);
  const [bg3Active, setBg3Active] = useState(false);
  const [isConfirmMode, setIsConfirmMode] = useState(false);

  const start = async () => {
    if (!isConfirmMode) {
      try {
        // 첫 번째 클릭: 포인트 추가 + 기존 애니메이션 실행 + 텍스트 변경
        await pointsService.creditPoints(500, 'FISHING_EVENT');
        setBg1Active(true);
        setBg2Active(true);
        setBg3Active(true);
        setIsConfirmMode(true);
      } catch (error) {
        console.error('포인트 추가 실패:', error);
        // 에러가 발생해도 애니메이션은 실행
        setBg1Active(true);
        setBg2Active(true);
        setBg3Active(true);
        setIsConfirmMode(true);
      }
    } else {
      // 두 번째 클릭: 확인 버튼 클릭 시 main 페이지로 이동
      window.location.href = '/';
    }
  };

  const closeEvent = () => {
    setIsVisible(false);
    setBg1Active(false);
    setBg2Active(false);
    setBg3Active(false);
  };

  return (
    <div className={styles.page_container}>
      {/* 이벤트 모달 */}
      {isVisible && (
        <div className={`${styles.event_wrap} ${styles.visible}`}>
          <div className={styles.cont}>
            <div className={styles.header}>
              <Image src="/images/event/box2.png" alt="박스2" width={440} height={100} />
              <Link href="/event" className={styles.close_button} onClick={closeEvent}>
                {/* 닫기 버튼 */}
              </Link>
            </div>

            <div className={styles.box}>
              <div className={styles.box_ui}>
                <div className={styles.reward_sections}>
                  <div className={styles.reward_section}>
                    <div className={styles.reward_header}>다시 방문하면</div>
                    <div className={styles.reward_text}>미끼 5개</div>
                  </div>

                  <div className={styles.reward_section}>
                    <div className={styles.reward_header}>친구 초대하면</div>
                    <div className={styles.reward_text}>미끼 15개</div>
                  </div>
                </div>

                <button className={styles.fishing_button} onClick={start}>
                  {isConfirmMode ? '확인' : '낚시하기'}
                </button>
              </div>
            </div>

            {/* 배경 1 */}
            <div className={`${styles.bg} ${styles.bg1} ${bg1Active ? styles.on : ''}`}>
              <Image src="/images/event/bg.png" alt="배경1" width={440} height={812} />
            </div>

            {/* 배경 2 (물고기들) */}
            <div className={`${styles.bg} ${styles.bg2} ${bg2Active ? styles.on : ''}`}>
              <div className={styles.fish_up}>
                <Image src="/images/event/hippocampus.png" alt="해마" width={26} height={26} />
              </div>
              <div className={`${styles.fish_left} ${styles.left1}`}>
                <Image src="/images/event/flying_fish1.png" alt="날치1" width={32} height={32} />
              </div>
              <div className={`${styles.fish_left} ${styles.left2}`}>
                <Image
                  src="/images/event/redfish2.png"
                  alt="붉은물고기2"
                  width={24}
                  height={24}
                  style={{ marginLeft: '35px' }}
                />
                <Image src="/images/event/redfish1.png" alt="붉은물고기1" width={36} height={36} />
              </div>
              <div className={`${styles.fish_right} ${styles.right1}`}>
                <Image src="/images/event/flying_fish2.png" alt="날치2" width={51} height={51} />
              </div>
              <div className={`${styles.fish_right} ${styles.right2}`}>
                <Image src="/images/event/stripe_fish.png" alt="줄무늬물고기" width={40} height={40} />
              </div>

              {/* 낚시줄과 바늘 */}
              <div className={styles.loop_box}>
                <div className={styles.fishing_line}>
                  <Image src="/images/event/fishing_line.png" alt="낚시줄" width={5} height={340} />
                </div>
                <div className={styles.fishing_hook}>
                  <Image src="/images/event/fishing_hook.png" alt="낚시바늘" width={43} height={43} />
                </div>
              </div>
            </div>

            {/* 배경 3 (결과) */}
            <div className={`${styles.bg} ${styles.bg3} ${bg3Active ? styles.on : ''}`}>
              <div className={styles.tide}>
                <Image src="/images/event/bg2.png" alt="파도" width={450} height={200} />
              </div>
              <div className={styles.crucian_carp}>
                <Image src="/images/event/crucian_carp.png" alt="붉은물고기" width={440} height={200} />
              </div>

              {/* 코인들 */}
              <Image
                src="/images/event/coin1.png"
                alt="코인1"
                className={`${styles.coin} ${styles.coin1}`}
                width={29}
                height={29}
              />
              <Image
                src="/images/event/coin2.png"
                alt="코인2"
                className={`${styles.coin} ${styles.coin2}`}
                width={34}
                height={34}
              />
              <Image
                src="/images/event/coin3.png"
                alt="코인3"
                className={`${styles.coin} ${styles.coin3}`}
                width={25}
                height={25}
              />
              <Image
                src="/images/event/coin4.png"
                alt="코인4"
                className={`${styles.coin} ${styles.coin4}`}
                width={29}
                height={29}
              />

              {/* 텍스트 */}
              <div className={styles.txt}>
                <Image src="/images/event/c_txt.png" alt="텍스트" width={167} height={50} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
