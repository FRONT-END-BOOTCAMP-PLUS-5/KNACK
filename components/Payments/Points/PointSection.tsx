'use client'

import { useState } from 'react'
import styles from './PointSection.module.scss'

interface PointSectionProps {
    availablePoints: number
    onChange: (points: number) => void
}

export default function PointSection({ availablePoints, onChange }: PointSectionProps) {
    const [showModal, setShowModal] = useState(false)
    const [inputValue, setInputValue] = useState<number | string>('');

    const MIN_POINT_USAGE = 1000

    const handleMaxUse = () => {
        if (availablePoints >= MIN_POINT_USAGE) {
            setInputValue(availablePoints)
        } else {
            alert(`${MIN_POINT_USAGE.toLocaleString()}P 이상부터 사용할 수 있습니다.`)
        }
    }

    return (
        <div className={styles.point_box}>
            <div className={styles.point_header}>
                <label>포인트</label>
                <div className={styles.available_points}>
                    <button onClick={() => setShowModal(true)} className={styles.infoButton}>
                        ⓘ
                    </button>
                    <span>{availablePoints.toLocaleString()}P</span>
                </div>
            </div>

            <div className={styles.input_group}>
                <input
                    type="text" // ✅ number 대신 text 사용
                    inputMode="numeric" // ✅ 모바일 키패드 숫자 전용
                    pattern="[0-9]*"    // ✅ 숫자만 허용 (폼 제출 시)
                    placeholder="0"
                    value={inputValue}
                    onChange={(e) => {
                        let raw = e.target.value;

                        // 숫자 이외 문자 제거
                        raw = raw.replace(/\D/g, '');

                        // 앞자리 0 제거 (단, 전체 지우는 건 허용)
                        if (raw.length > 1 && raw.startsWith('0')) {
                            raw = raw.replace(/^0+/, '');
                        }

                        // 최대 사용 가능 포인트 제한
                        const num = Math.min(Number(raw || '0'), availablePoints);

                        setInputValue(num === 0 ? '' : String(num)); // 0이면 공란 처리
                        onChange(num); // 부모로는 숫자 전달
                    }}
                />
                <button onClick={handleMaxUse} disabled={availablePoints < MIN_POINT_USAGE}>
                    최대 사용
                </button>
            </div>

            {showModal && (
                <div className={styles.modal_backdrop} onClick={() => setShowModal(false)}>
                    <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
                        <h3>포인트 안내</h3>
                        <p>
                            포인트 유효기간은 적립일로부터 최대 1년까지이며, 유형에 따라 달라질 수 있습니다.<br /><br />
                            1,000P 이상부터 구매금액 제한 없이 사용하실 수 있습니다.<br />
                            입찰 삭제, 거래 취소 시 사용한 포인트는 환불됩니다.<br />
                            먼저 적립된 포인트부터 순서대로 사용되며, 사용하지 않으실 경우 유효기간이 지나면 자동 소멸됩니다.<br />
                            유효기간이 지난 후 환불받은 포인트는 다시 사용하실 수 없습니다.
                        </p>
                        <button onClick={() => setShowModal(false)}>확인</button>
                    </div>
                </div>
            )}
        </div>
    )
}
