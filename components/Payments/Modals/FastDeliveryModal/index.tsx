// components/FastDeliveryModal.tsx
'use client'

import { useEffect } from 'react'
import styles from './fastDeliveryModal.module.scss'
import Image from 'next/image'

type Props = { onClose: () => void }

export default function FastDeliveryModal({ onClose }: Props) {
    // ESC로 닫기 + 바디 스크롤 잠금
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
    }, [onClose])

    const stop = (e: React.MouseEvent) => e.stopPropagation()

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
            <section className={styles.modal} onClick={stop}>
                <header className={styles.header}>
                    <h2 className={styles.header_title}>배송정보 | KNACK</h2>
                    <button className={styles.close} aria-label="닫기" onClick={onClose}>✕</button>
                </header>

                <div className={styles.hero}>
                    <h3 className={styles.title}>빠른배송</h3>
                    <div className={styles.icon_wrap} aria-hidden>
                        {/* 번개 아이콘 (배경 투명, currentColor) */}
                        <Image src="/icons/lightning_circle.png" alt="번개" width={78} height={78} />
                    </div>
                    <p className={styles.lead}>KNACK의 엄격한 다중 검수에 합격한 상품으로 빠른배송 결제 시 내일 도착하는 배송 서비스 입니다.</p>
                </div>

                <section className={styles.section}>
                    <h4 className={styles.section_title}>검수 합격한 보관 상품</h4>
                    <p className={styles.body}>판매자가 보관 신청한 상품 중 검수에 합격한 상품은 KNACK의 전용 창고에 보관합니다. 보관 상품에 한하여 오늘 구매 시 내일 도착 가능한 빠른배송 서비스를 제공하고 있습니다.</p>
                </section>

                <section className={styles.section}>
                    <h4 className={styles.section_title}>오늘 주문 내일 출발</h4>
                    <p className={styles.caption}>밤 11시 59분까지 결제 시, 다음 날 즉시 출고됩니다.</p>
                    <div className={styles.table} role="table">
                        <div className={styles.thead} role="row">
                            <div className={styles.th} role="columnheader">주문 일시</div>
                            <div className={styles.th} role="columnheader">출고 예정일</div>
                        </div>
                        <div className={styles.tr} role="row">
                            <div className={styles.td} role="cell">평일 밤 11:59까지</div>
                            <div className={styles.td} role="cell">다음 날</div>
                        </div>
                        <div className={styles.tr} role="row">
                            <div className={styles.td} role="cell">토/일요일 밤 11:59까지</div>
                            <div className={styles.td} role="cell">월요일</div>
                        </div>
                    </div>
                    <p className={styles.note}>* 일요일·공휴일, 천재지변, 택배사 사유 등 예외사항으로 출고일 변경이 발생할 수 있습니다.</p>
                </section>

                <section className={styles.section}>
                    <h4 className={styles.section_title}>95점 빠른배송</h4>
                    <p className={styles.body}>KNACK 검수 기준의 구매자 의사 확인에 해당하는 상품입니다. 95점 상품의 원판, 세부 흠칠 사진을 직접 확인하고 구매할 수 있습니다.</p>
                </section>
            </section>
        </div>
    )
}
