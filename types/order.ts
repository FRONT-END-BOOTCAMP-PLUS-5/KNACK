// types/order.ts
import { IOptionValue } from './product';
import { IAddress, IAddressRef } from './address';

/* ---------- 장바구니/주문 ---------- */

export const STEPS = ["구매 확정", "배송 대기", "배송 중", "배송 완료"] as const;
export type Step = typeof STEPS[number];

export type CheckoutRow = {
  productId: number;
  quantity: number;
  optionValueId?: number;
  deliveryMethod: 'normal' | 'fast' | string;
};

export type OrderItem = {
  productId: number;
  price: number;
  quantity: number;
  thumbnail_image: string;
  deliveryType: string;
  kor_name?: string;
  eng_name?: string;
  optionValue?: IOptionValue;
};

export interface OrderResponse {
  id?: number;
  orderId?: number;
  orderNumber?: string;
  number?: string;
  product?: {
    engName?: string;
    thumbnailImage?: string;
  };
  productTitle?: string;
  title?: string;
  size?: string;
  option?: string;
  variant?: string;
  shippingType?: string;
  deliveryType?: string;
  statusText?: string;
  status?: string;
  thumbnailImage?: string;
  imageUrl?: string;
}

export type ComputeTotalsOrder = {
  price?: number | unknown;
  count?: number;
  shippingFee?: number;
  deliveryFee?: number;
  shipFee?: number;
  couponPrice?: number;
  point?: number;
}

export interface RepresentativeProduct {
  id: number;
  korName: string;
  engName: string;
  thumbnailImage: string;
  name: string;
  price: number;
}

export type RepoPayment = {
  point: number;
  couponPrice: number;
  id: number;
  userId: string;
  address?: RepoAddress | null;
  price?: number | bigint | null;
  createdAt?: Date | null;
  paymentNumber: bigint;
  tossPaymentKey?: string | null;
  approvedAt?: Date | null;
  method?: string | null;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED' | 'CONFIRMED' | 'DELIVERING' | 'COMPLETED' | string;
  orders: Array<{
    id: number;
    status: string;
    orderItems: Array<{
      optionValue: IOptionValue;
      id: number;
      productId: number;
      quantity: number;
      price: number | bigint;
      salePrice?: number | bigint;
      couponPrice?: number;
      point?: number;
      product?: { korName?: string | null; engName?: string | null; thumbnailImage?: string | null } | null;
      productName?: string | null;
    }>;
  }>;
};

export type RepoIndependentOrder = {
  id: number;
  userId: string;
  productId: number;
  price: number | bigint;
  salePrice?: number | bigint;
  tracking?: string | null;
  createdAt?: Date | null;
  deliveryStatus?: number;
  count?: number;
  paymentId?: number;
  optionValueId?: number;
  quantity?: number;
  product?: { korName?: string | null; engName?: string | null; thumbnailImage?: string | null } | null;
  optionValue?: { id: number; name: string; value?: string } | null;
  address?: RepoAddress | null;
}

export type DtoStatus = 'DONE' | 'PENDING' | 'FAILED' | 'CANCELED' | 'CONFIRMED' | 'DELIVERING' | 'COMPLETED' | string;

export type OrderPageProps = { params: { id: string } };

const addressSelect = {
  id: true,
  name: true,      // or name
  phone: true,         // or phoneNumber
  zipCode: true,       // or postalCode
  main: true,      // or line1 / address
  detail: true,      // or line2 / detailAddress
  message: true,       // 배송 요청사항
} as const

// 기존 아이템 그래프 include (관계명은 스키마에 맞게)
export const graphInclude = {
  address: { select: addressSelect },
  orders: {
    // 너 스키마가 "orders가 곧 아이템"이면 필요한 필드 select
    // 만약 orders -> orderItems 구조면 아래처럼 변경:
    // include: { orderItems: { include: { product: true, optionValue: true } } }
    select: {
      id: true,
      userId: true,
      productId: true,
      price: true,
      salePrice: true,
      tracking: true,
      createdAt: true,
      deliveryStatus: true,
      count: true,          // or quantity
      paymentId: true,
      couponPrice: true,
      point: true,
      optionValueId: true,
      product: {
        select: {
          id: true,
          korName: true,
          engName: true,
          thumbnailImage: true,
          price: true,
        },
      },
      optionValue: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} as const

export type RepoOrder = {
  orderItems?: RepoOrderItem[];
};

export type RepoAddress = {
  id: number;
  name: string;
  phone: string;
  zipCode: string;
  main: string;
  detail: string | null;
  message: string | null;
};

export type RepoOrderItem = {
  id: number;
  productId: number;
  paymentId: number;
  payment: {
    paymentNumber: bigint;
  }
  price: number | bigint;
  salePrice?: number | bigint;
  quantity?: number;
  count?: number;
  tracking?: string | null;
  approvedAt?: Date;
  createdAt?: Date;
  deliveryStatus?: number;
  optionValueId?: number;
  couponPrice?: number;
  point?: number;
  product?: {
    id: number;
    korName?: string;
    engName?: string;
    thumbnailImage?: string;
  };
  optionValue?: {
    id: number;
    name: string;
    value?: string;
  };
};

export type ProcessedPayment = {
  orderId: string;
  paymentKey: string;
};

/* ---------- 주소 ---------- */

export interface AddressAddModalProps {
  onClose: () => void;
  onSaved?: (addr: IAddress) => void;
  editing?: IAddress | null;
  /** 신규 등록 시 카카오 검색에서 넘겨줄 초기값 (선택) */
  initial?: Partial<Pick<IAddress['address'], 'zipCode' | 'main'>>;
}

/* AddressBox props */
export type AddressBoxProps = {
  IAddress: IAddress | null;
  onOpenModal: () => void;
  onOpenRequestModal?: () => void;
  onChangeRequest: (request: string) => void;
};

/* RequestModal props */
export type RequestModalProps = {
  open: boolean;
  value: string;
  onClose: () => void;
  onApply: (next: string) => void;
};

/* AddressModal props */
export type AddressModalProps = {
  onClose: () => void;
  selectedAddress: IAddress | null;
  onChangeSelected: (addr: IAddress) => void;
};

/* ---------- 포인트/결제 요약 ---------- */
export type PointSectionProps = {
  availablePoints: number;
  maxUsablePoints: number;
  onChange: (value: number) => void;
};

export interface PaymentFooterProps {
  totalPrice: number;
  onPay: () => void;
  disabled?: boolean;
}

export interface FinalOrderSummaryProps {
  price: number;
  fee?: number;
  shippingFee: number;
  couponAmount?: number;
  pointAmount?: number;
}

/* ---------- 쿠폰 (단일 표준) ---------- */
export type Coupon = {
  createdAt: string | number | Date | null | undefined;
  id: number;
  name: string;
  salePercent: number;
  productId: number;
  expirationAt?: string | null;
};

export type CouponSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  coupons: Coupon[];
  orderItems: OrderItem[];
  selectedCouponId: number | null;
  onSelectCoupon: (couponId: number | null) => void;
};

export type BestCoupon = { id: number | null; discount: number };

/* OrderSummaryCard: 로직 외부 계산/제어 */
export type OrderSummaryCardProps = {
  orderItems: OrderItem[];
  deliveryType: 'FAST' | 'STOCK';
  onChangeDelivery: (t: 'FAST' | 'STOCK') => void;

  baseSum: number;
  shippingFee: number;
  couponDiscount: number;
  totalPayable: number;

  selectedCouponName?: string | null;
  applicableCouponCount: number;
  onOpenCouponModal: () => void;
  onClearCoupon?: () => void;

  onItemMenuClick?: (item: OrderItem) => void;
};

/* ---------- 서버 confirm 입력 (서버 영역으로 옮기는 걸 권장) ---------- */
export type CouponInput = {
  userId: string;
  tossPaymentKey: string;
  orderId: string;
  amount: number;
  addressId: number;
  orderIds: string[];
  method: string;
  status: 'DONE' | 'CANCELED';
  approvedAt: Date;
  requestedAt: Date;
  card?: {
    issuerCode?: string;
    acquirerCode?: string;
    number?: string;
    installmentPlanMonths?: number;
    approveNo?: string;
    useCardPoint?: boolean;
    isInterestFree?: boolean;
  };
  selectedCouponId?: number | null;
};

export type RouteContext = {
  params: { id: string }; // Promise 아님!
};

/* ---------- (백엔드 전용: 필요 시 위치 이동 권장) ---------- */
export type AdjustPointsResult = { availablePoints: number; delta: number };
