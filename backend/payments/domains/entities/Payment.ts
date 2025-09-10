export interface Payment {
  id: string;
  userId: string;
  addressId: string;
  price: number;
  createdAt: Date;
  paymentNumber: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED' | 'CONFIRMED' | 'DELIVERING' | 'COMPLETED';
}

export interface IPaymentList {
  id: number;
  approvedAt: string;
  paymentNumber: string;
  orders: IOrderItem[];
}

interface IOrderItem {
  id: number;
  paymentId?: number | null;
  thumbnailImage: string;
  korName?: string;
  engName: string;
  optionName: string;
  optionValue: string;
  deliveryStatus: number | null;
  point?: number;
  couponPrice?: number;
  price?: number | null;
}

export interface IPaymentDetail {
  id?: number;
  approvedAt: string;
  paymentNumber?: string;
  method?: string;
  price?: number | null;
  orders?: IOrderItem[];
}
