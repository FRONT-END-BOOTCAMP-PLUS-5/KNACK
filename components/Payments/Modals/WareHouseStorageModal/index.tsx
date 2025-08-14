'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './warehouseStorageModal.module.scss'
import Image from 'next/image'

type Props = { onClose: () => void }

export default function WarehouseStorageModal({ onClose }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
            document.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    const stop = (e: React.MouseEvent) => e.stopPropagation()

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
            <div className={styles.modal} onClick={stop}>
                <header className={styles.header}>
                    <h2 className={styles.headerTitle}>배송정보 | KNACK</h2>
                    <button className={styles.close} aria-label="닫기" onClick={onClose}>✕</button>
                </header>

                <div className={styles.body}>
                    {/* Hero */}
                    <div className={styles.hero}>
                        <h3 className={styles.title}>창고보관</h3>
                        <div className={styles.iconWrap} aria-hidden>
                            {/* 창고 아이콘 */}
                            <Image src="/icons/ico_shipping_storage.png" alt="창고" width={72} height={72} />
                        </div>
                        <p className={styles.lead}>창고보관은 구매한 상품을 배송받지 않고 KNACK 창고에 보관하여 언제든 빠르게 판매할 수 있는 서비스입니다.</p>
                    </div>

                    {/* 흐름 카드 */}
                    <div className={styles.flowCard} aria-hidden>
                        <div className={styles.flowItem}>
                            <Image src="/images/inventory_keep_process_1.png" alt="창고" width={460} height={110} />
                        </div>
                    </div>

                    {/* 섹션 1 */}
                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}>배송비 없이 창고로 이동</h4>
                        <p className={styles.bodyText}>구매 상품을 창고로 배송하는 비용은 무료이며, 언제든 되찾고 싶을 때 회수 신청이 가능합니다.</p>
                    </section>

                    {/* 섹션 2 */}
                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}>첫 30일은 창고 이용료가 무료</h4>
                        <p className={styles.bodyText}>구매 후 검수에 합격할 경우, KNACK 창고에서 최대 120일까지 안전하게 보관해드립니다.</p>
                        <ul className={styles.noteList}>
                            <li>창고 이용료는 30일 단위로 3,000원/건 결제</li>
                            <li>보관 중 회수 비용 무료</li>
                            <li>첫 30일 이내 회수 시, 이후 연장 및 이용료 없음</li>
                        </ul>
                    </section>

                    {/* 섹션 3 */}
                    <section className={styles.section}>
                        <h4 className={styles.sectionTitle}>검수 불합격 걱정 없이 빠른 판매 가능</h4>
                        <p className={styles.bodyText}>검수 합격된 상품이 창고에 보관되므로 반송 걱정 없이 바로 판매 가능하며, 거래가 체결되면 다음날 즉시 정산됩니다.</p>
                        <div className={styles.inlineCard} aria-hidden>
                            <Image src="/images/inventory_keep_process_2.png" alt="창고" width={460} height={110} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
