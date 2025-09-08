export interface CreatePaymentDto {
  paymentNumber: string;
  tossPaymentKey: string | null; // Toss에서 발급한 고유 결제 키
  price: number; // 실제 결제된 총 금액
  salePrice: number;
  approvedAt: string; // Toss에서 결제가 승인된 시간
  method: string; // 결제 방식 (ex. 카드, 가상계좌 등)
  status: 'DONE' | 'CANCELED'; // 결제 상태
  userId: string; // 결제 요청한 유저 ID
  detailAddress: string;
  mainAddress: string;
  name: string;
  username: string;
  zipCode: string;
}
