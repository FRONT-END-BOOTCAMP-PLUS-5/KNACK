'use client';

import { useState } from 'react';
import styles from './PointSection.module.scss';
import { IToastState } from '@/components/common/MaterialToast';

interface IProps {
  availablePoints: number;
  maxUsablePoints: number;
  onChange: (value: number) => void;
  setToastOpen: (value: IToastState) => void;
}

export default function PointSection({ availablePoints, maxUsablePoints, onChange, setToastOpen }: IProps) {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  const MIN_POINT_USAGE = 1000;
  const clamp = (n: number) => Math.max(0, Math.min(n, Math.min(availablePoints, maxUsablePoints)));

  const handleMaxUse = () => {
    const cap = Math.min(availablePoints, maxUsablePoints);
    if (cap < MIN_POINT_USAGE) {
      setToastOpen({ open: true, message: `${MIN_POINT_USAGE.toLocaleString()}P 이상부터 사용할 수 있습니다.` });
      return;
    }
    setInputValue(String(cap));
    onChange(cap);
  };

  return (
    <>
      <section className={styles.point_box}>
        <h3 className={styles.title}>포인트</h3>

        <div className={styles.row}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={inputValue}
            onChange={(e) => {
              let raw = e.target.value.replace(/\D/g, '');
              if (raw.length > 1) raw = raw.replace(/^0+/, '');
              const num = clamp(Number(raw || '0'));
              setInputValue(num === 0 ? '' : String(num));
              onChange(num);
            }}
          />
          <button
            type="button"
            className={styles.side_btn}
            onClick={handleMaxUse}
            disabled={Math.min(availablePoints, maxUsablePoints) < MIN_POINT_USAGE}
          >
            최대 사용
          </button>
        </div>

        <div className={styles.sub_info}>
          <button type="button" className={styles.help} aria-label="포인트 안내" onClick={() => setShowModal(true)}>
            ?
          </button>
          <span className={styles.caption}>보유 포인트</span>
          <strong className={styles.point}>{availablePoints.toLocaleString()}P</strong>
        </div>

        {showModal && (
          <div className={styles.modal_backdrop} onClick={() => setShowModal(false)}>
            <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
              <h4>포인트 안내</h4>
              <p>
                포인트 유효기간은 적립일로부터 최대 1년까지이며 유형에 따라 달라질 수 있습니다.
                <br />
                <br />
                1,000P 이상부터 구매금액 제한 없이 사용 가능합니다.
                <br />
                입찰 삭제, 거래 취소 시 사용한 포인트는 환불됩니다.
                <br />
                먼저 적립된 포인트부터 차감되며, 유효기간 경과 시 자동 소멸됩니다.
              </p>
              <button className={styles.modal_ok} onClick={() => setShowModal(false)}>
                확인
              </button>
            </div>
          </div>
        )}
      </section>
      <div className={styles.divider_line} />
    </>
  );
}
