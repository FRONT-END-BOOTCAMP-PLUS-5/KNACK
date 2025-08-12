'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './requestModal.module.scss';
import Image from 'next/image';
import { requestProps } from '@/types/order';
import { PRESETS } from '@/constraint/order';

export default function RequestModal({ open, value, onClose, onApply }: requestProps) {
    const [selected, setSelected] = useState<string>('');
    const [custom, setCustom] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    // 초기 선택값 동기화
    useEffect(() => {
        if (!open) return;
        if (!value) {
            setSelected('요청사항 없음');
            setCustom('');
        } else if (PRESETS.includes(value as typeof PRESETS[number])) {
            setSelected(value);
            setCustom('');
        } else {
            setSelected('직접 입력');
            setCustom(value);
            // 다음 프레임에 포커스
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open, value]);

    const isCustom = selected === '직접 입력';
    const canApply = useMemo(() => {
        if (selected === '요청사항 없음') return true;
        if (isCustom) return custom.trim().length > 0;
        return !!selected;
    }, [selected, isCustom, custom]);

    if (!open) return null;

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="배송 요청사항">
            <div className={styles.sheet}>
                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.back} onClick={onClose} aria-label="닫기">
                        <Image src="/icons/header-back.svg" alt="뒤로가기" width={24} height={24} />
                    </button>
                    <div className={styles.title}><p>배송 요청사항</p></div>
                    <div className={styles.rightSpacer} />
                </div>

                {/* List */}
                <div className={styles.list}>
                    {PRESETS.map(opt => (
                        <button
                            type="button"
                            key={opt}
                            className={styles.item}
                            onClick={() => setSelected(opt)}
                            aria-pressed={selected === opt}
                        >
                            <span className={styles.itemLabel}>{opt}</span>
                            {selected === opt && <span className={styles.check} aria-hidden><Image src="/icons/check.svg" alt="체크" width={24} height={24} /></span>}
                        </button>
                    ))}

                    {isCustom && (
                        <div className={styles.customBox}>
                            <input
                                ref={inputRef}
                                className={styles.input}
                                type="text"
                                placeholder="내용을 입력해주세요.(최대 40자)"
                                value={custom}
                                onChange={(e) => setCustom(e.target.value)}
                                maxLength={40}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button
                        className={styles.applyBtn}
                        disabled={!canApply}
                        onClick={() => {
                            const next =
                                selected === '요청사항 없음' ? '' :
                                    isCustom ? custom.trim() :
                                        selected;
                            onApply(next);
                            onClose();
                        }}
                    >
                        적용하기
                    </button>
                </div>
            </div>
        </div>
    );
}
