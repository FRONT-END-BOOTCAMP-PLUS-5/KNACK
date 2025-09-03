export interface CreatePaymentDto {
  createdAt: Date;
  addressId: number;
  paymentNumber: string;
  tossPaymentKey: string | null; // Toss에서 발급한 고유 결제 키
  price: number; // 실제 결제된 총 금액
  salePrice: number;
  approvedAt: Date; // Toss에서 결제가 승인된 시간
  method: string; // 결제 방식 (ex. 카드, 가상계좌 등)
  status: 'DONE' | 'CANCELED'; // 결제 상태
  userId: string; // 결제 요청한 유저 ID
  orderIds: number[]; // 결제된 주문 ID 목록
}
