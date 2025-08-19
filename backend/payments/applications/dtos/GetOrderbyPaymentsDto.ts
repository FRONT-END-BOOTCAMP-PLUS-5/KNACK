import { DtoStatus, RepoAddress } from "@/types/order";

export interface GetOrderbyPaymentsDto {
    id: number;
    createdAt: Date;
    address: RepoAddress | null;
    paymentNumber: bigint;
    tossPaymentKey: string | null; // Toss에서 발급한 고유 결제 키
    price: number; // 실제 결제된 총 금액
    approvedAt: Date; // Toss에서 결제가 승인된 시간
    method: string; // 결제 방식 (ex. 카드, 가상계좌 등)
    status: DtoStatus; // 결제 상태
    userId: string; // 결제 요청한 유저 ID
    orders: {
        id: number;
        userId: string;
        productId: number;
        price: number;
        salePrice: number;
        tracking: string | null;
        createdAt: Date;
        deliveryStatus: number | null;
        count: number;
        optionValueId: number;
        product: {
            id: number;
            korName: string;
            engName: string;
            thumbnailImage: string | null;
        };
        optionValue: {
            id: number;
            value: string;
        };
    }[]; // 결제된 주문 목록
}

