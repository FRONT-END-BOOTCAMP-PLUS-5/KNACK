import prisma from '@/backend/utils/prisma';
import { PaymentRepository } from '@/backend/payments/domains/repositories/PaymentRepository';
import { CreatePaymentDto } from '@/backend/payments/applications/dtos/CreatePaymentDto';
import { GetPaymentDto } from '@/backend/payments/applications/dtos/GetPaymentDto';
import { IPaymentDetail, IPaymentList } from '../domains/entities/Payment';

export class PrPaymentRepository implements PaymentRepository {
  async markPaid({
    id,
    method,
    approvedAt,
    requestedAt,
    tossPaymentKey,
  }: {
    id: number;
    method: string;
    approvedAt: Date;
    requestedAt?: Date | null;
    tossPaymentKey: string;
  }): Promise<boolean> {
    const res = await prisma.payment.updateMany({
      where: { id, status: 'CONFIRMING', tossPaymentKey },
      data: {
        status: 'PAID',
        method,
        approvedAt,
        createdAt: requestedAt ?? new Date(),
      },
    });
    return res.count === 1;
  }

  async save(payment: CreatePaymentDto): Promise<number> {
    const created = await prisma.payment.create({
      data: {
        userId: payment.userId,
        price: payment.price,
        paymentNumber: payment.paymentNumber,
        tossPaymentKey: payment.tossPaymentKey,
        approvedAt: payment.approvedAt ?? new Date(),
        method: payment.method,
        status: payment.status,
        mainAddress: payment.mainAddress ?? '',
        detailAddress: payment.detailAddress,
        name: payment.name ?? '',
        username: payment.username ?? '',
        zipCode: payment.zipCode ?? '',
        phone: payment.phone,
      },
    });

    return created.id;
  }

  async updateOrderPaymentIds(orderIds: number[], paymentId: number): Promise<void> {
    await prisma.order.updateMany({
      where: { id: { in: orderIds } },
      data: { paymentId },
    });
  }

  async updateStatusByTossPaymentKey(tossPaymentKey: string, status: string): Promise<void> {
    await prisma.payment.update({
      where: { tossPaymentKey }, // 🔧 paymentNumber → TossPaymentKey로 수정
      data: { status },
    });
  }

  async findByTossPaymentKey(tossPaymentKey: string): Promise<GetPaymentDto | null> {
    const data = await prisma.payment.findUnique({
      where: { tossPaymentKey },
      include: {
        orders: { select: { id: true } },
      },
    });

    if (!data) return null;

    return {
      id: data.id,
      userId: data.userId,
      price: data.price ?? 0,
      createdAt: data.createdAt ?? new Date(),
      paymentNumber: data.paymentNumber,
      tossPaymentKey: data.tossPaymentKey ?? '',
      approvedAt: data.approvedAt ?? new Date(),
      method: data.method,
      status: data.status as 'DONE' | 'CANCELED',
      orderIds: data.orders.map((order) => order.id),
    };
  }

  async generateTodayPaymentNumber(): Promise<string> {
    const latestPayment = await prisma.payment.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        tossPaymentKey: true,
      },
    });

    const paymentNumber = latestPayment?.tossPaymentKey ? latestPayment?.tossPaymentKey?.substring(5, 19) : '0';

    return paymentNumber;
  }

  // 하나의 주문 가져오기
  async findWithOrdersById(id: number, userId: string): Promise<IPaymentDetail | null> {
    const data = await prisma.payment.findFirst({
      where: { id: id, userId },
      select: {
        id: true,
        paymentNumber: true,
        approvedAt: true,
        method: true,
        price: true,
        orders: {
          select: {
            id: true,
            engName: true,
            optionName: true,
            optionValue: true,
            deliveryStatus: true,
            price: true,
            couponPrice: true,
            point: true,
            thumbnailImage: true,
          },
        },
      },
    });

    const conversionData = { ...data, approvedAt: String(data?.approvedAt) };

    return conversionData;
  }

  // 유저의 모든 주문 가져오기
  async findWithOrderItemsByUserId(userId: string): Promise<IPaymentList[]> {
    const data = await prisma.payment.findMany({
      where: { userId: userId },
      select: {
        id: true,
        approvedAt: true,
        paymentNumber: true,
        orders: {
          select: {
            id: true,
            paymentId: true,
            thumbnailImage: true,
            korName: true,
            engName: true,
            optionName: true,
            optionValue: true,
            deliveryStatus: true,
          },
        },
      },
    });

    const dataToMap = data?.map((item) => {
      return {
        ...item,
        approvedAt: String(item?.approvedAt),
      };
    });

    return dataToMap;
  }
}
