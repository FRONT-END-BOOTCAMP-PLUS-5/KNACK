import { ComputeTotalsOrder, DtoStatus, Step, STEPS } from '@/types/order';
import styles from './orderUtils.module.scss';

export function normalizeStatus(s: string): DtoStatus {
  const u = s.toUpperCase();
  if (u === 'PAID') return 'DONE';
  if (u === 'PENDING') return 'PENDING';
  if (u === 'FAILED') return 'FAILED';
  if (u === 'CANCELED' || u === 'CANCELLED') return 'CANCELED';
  return 'FAILED'; // 알 수 없는 값은 실패로 폴백(또는 throw)
}

// 공용 유틸: 객체 전체에서 bigint를 문자열로 바꿔줌
export function serializeBigInt<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? v.toString() : v)));
}

export function toNum(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * 주문 목록에서 각종 금액을 합산.
 */

export function computeTotalsFromOrders(orders: ComputeTotalsOrder[] = []) {
  let subtotal = 0;
  let shippingFee = 0;
  let couponUsed = 0;
  let pointsUsed = 0;

  for (const o of orders) {
    const price = toNum((o as Record<string, unknown>)?.price ?? 0);

    const qty = Math.max(1, toNum(o.count, 1));

    const lineSubtotal = price * qty;
    subtotal += lineSubtotal;

    shippingFee += toNum(o.shippingFee ?? o.deliveryFee ?? o.shipFee ?? 0);

    couponUsed += Math.abs(toNum(o.couponPrice ?? 0));

    pointsUsed += Math.abs(toNum(o.point ?? 0));
  }

  const total = Math.max(0, subtotal + shippingFee - couponUsed - pointsUsed);

  return {
    subtotal,
    shippingFee,
    couponUsed,
    pointsUsed,
    total,
  };
}

export function ProgressBar({ current }: { current: Step }) {
  const currentIdx = Math.max(0, STEPS.indexOf(current)); // -1 방지

  return (
    <div className={styles.progress}>
      {STEPS.map((label, i) => (
        <div key={label} className={styles.step}>
          {/* 막대 (현재 단계 포함해서 진하게) */}
          <div className={`${styles.bar} ${i <= currentIdx ? styles.active : ''}`} />
          {/* 라벨 (현재 단계는 볼드) */}
          <div className={`${styles.step_label} ${i === currentIdx ? styles.current : ''}`}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export function formatPrice(n?: number) {
  return (n ?? 0).toLocaleString() + '원';
}

export function statusToStep(status?: number): Step {
  const deliveryStatus = status ?? 1;
  if (deliveryStatus === 1) return '구매 확정';
  if (deliveryStatus === 2) return '배송 대기';
  if (deliveryStatus === 3) return '배송 중';
  if (deliveryStatus === 4) return '배송 완료';
  return '구매 확정';
}

// KST로 YY/MM/DD HH:mm 포맷
export const formatKST = (d?: string | Date | null) => {
  if (!d) return '';
  const dt = new Date(d);
  // KST 보정
  const kst = new Date(dt.getTime() + 9 * 60 * 60 * 1000);
  const yy = String(kst.getUTCFullYear()).slice(2);
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const min = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${yy}/${mm}/${dd} ${hh}:${min}`;
};
