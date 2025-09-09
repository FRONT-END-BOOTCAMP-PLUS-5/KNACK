import prisma from '@/backend/utils/prisma';
import { PaymentRepository } from '@/backend/payments/domains/repositories/PaymentRepository';
import { CreatePaymentDto } from '@/backend/payments/applications/dtos/CreatePaymentDto';
import { GetPaymentDto } from '@/backend/payments/applications/dtos/GetPaymentDto';
import { RepoPayment } from '@/types/order';

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

  async findWithOrdersById(paymentId: number, userId: string): Promise<RepoPayment | null> {
    const data = await prisma.payment.findFirst({
      where: { id: paymentId, userId },
      include: {
        orders: true,
      },
    });
    return data as unknown as RepoPayment | null;
  }
}
