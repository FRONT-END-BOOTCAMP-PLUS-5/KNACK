import { OrderRow } from './order';

export type PaymentStatus = 'PENDING' | 'CONFIRMING' | 'PAID' | 'FAILED'; // Local 상태

export interface PaymentRecord {
  id: number;
  userId: string;
  addressId: number;
  amount: number;
  status: PaymentStatus;
  tossPaymentKey: string | null;
  paymentNumber: string | null;
  approvedAt?: Date | null;
  method?: string | null;
  createdAt?: Date | null;
}

export interface TossConfirmResult {
  paymentKey: string;
  method: string;
  status: 'DONE' | 'CANCELED'; // Toss 상태
  approvedAt?: string;
  requestedAt?: string;
  amount: number;
  card?: {
    issuerCode?: string;
    acquirerCode?: string;
    number?: string;
    installmentPlanMonths?: number;
    approveNo?: string;
    useCardPoint?: boolean;
    isInterestFree?: boolean;
  };
  totalAmount: number;
  balanceAmount: number;
  suppliedAmount: number;
  vat: number;
}

export interface TossGateway {
  confirmPayment(args: { tossPaymentKey: string; amount: number }): Promise<TossConfirmResult>;
}

export type Item = {
  id: string;
  orderNumber: string; // 예: B-SN123376520
  title: string; // 예: Vans Classic Slip-On Black
  optionText: string; // 예: 245 / 일반배송
  status?: '대기 중' | '결제 완료' | '취소됨' | string;
  imageUrl: string;
};

export type Totals = {
  subtotal: number; // 총 구매가
  shippingFee: number; // 총 배송비
  couponUsed?: number; // 총 쿠폰 사용 (없으면 표시 "-")
  pointsUsed?: number; // 총 포인트 사용 (없으면 표시 "-")
  total: number; // 최초 결제금액(= 최종 결제금액)
};

export type Info = {
  paymentNumber: string; // 예: O-OR34947640
  transactedAt: Date; // 거래 일시
  cardMasked: string; // 예: KB국민카드 ••••••••••700*
};

export type ReceiptItem = {
  id: string;
  orderNumber: string;
  title: string;
  optionText: string;
  status?: string;
  imageUrl: string;
};

export type PaymentData = {
  orders?: unknown[]; // 서버 스키마 다양성 고려
  approvedAt?: string;
  totals?: {
    subtotal?: number;
    shippingFee?: number;
    couponUsed?: number;
    pointsUsed?: number;
    total?: number;
  };
  paymentNumber?: string | number;
  cardMasked?: string;
};

export type Payment = {
  id: number;
  paymentNumber: string;
  method: string;
  approvedAt?: string | Date | null;
  createdAt?: string | Date | null;
  orders: OrderRow[];
};

export interface IPaymentSessionData {
  pointAmount: number;
  couponDiscountAmount: number;
  shippingFee: number;
  targetSumAfterCoupon: number;
  name: string;
  mainAddress: string;
  detailAddress: string;
  zipCode: string;
  phone: string;
}

export interface IPaymentRef {
  amount: number; // 실제 결제된 총 금액
  salePrice: number;
  detailAddress: string;
  mainAddress: string;
  name: string;
  zipCode: string;
  tossPaymentKey: string;
  pointAmount: number;
  orderId: string;
  phone: string;
}

export interface IPaymentList {
  id: number;
  approvedAt: string;
  paymentNumber: string;
  orders: IOrderItem[];
}

export interface IOrderItem {
  id: number;
  paymentId: number | null;
  thumbnailImage: string;
  korName: string;
  engName: string;
  optionName: string;
  optionValue: string;
  deliveryStatus: number | null;
}
