export interface CreateCardDto {
  paymentId: number;
  issuerCode: string; // 카드 발급사
  acquirerCode: string; // 카드 매입사
  number: string; // 카드 BIN 또는 마스킹 카드번호
  installmentPlanMonths: number; // 할부 개월 수 (0은 일시불)
  approveNo: string; // 승인번호
  useCardPoint: boolean; // 카드 포인트 사용 여부
  isInterestFree: boolean; // 무이자 여부
}
