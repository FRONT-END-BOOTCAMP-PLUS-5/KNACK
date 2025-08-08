// 📁 backend/infrastructure/db/PrismaPaymentRepository.ts
import { PrismaClient } from '@prisma/client';
import { PaymentRepository } from '@/backend/payments/domains/repositories/PaymentRepository';
import { CreatePaymentDto } from '@/backend/payments/applications/dtos/CreatePaymentDto';

const prisma = new PrismaClient();

export class KnackPaymentRepository implements PaymentRepository {
  async save(payment: CreatePaymentDto): Promise<void> {
    const created = await prisma.payment.create({
      data: {
        userId: payment.userId,
        addressId: payment.addressId,
        price: payment.price,
        createdAt: payment.createdAt ?? new Date(),
        paymentNumber: payment.paymentNumber,
        tossPaymentKey: payment.tossPaymentKey,
        approvedAt: payment.approvedAt ?? new Date(),
        method: payment.method,
        status: payment.status,
        orders: {
          connect: payment.orderIds.map((id) => ({ id })), // ✅ 결제에 주문 연결
        },
      },
    });
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

  async findByTossPaymentKey(tossPaymentKey: string): Promise<CreatePaymentDto | null> {
    const data = await prisma.payment.findUnique({
      where: { tossPaymentKey },
      include: {
        orders: { select: { id: true } },
      },
    });

    if (!data) return null;

    return {
      userId: data.userId,
      addressId: data.addressId,
      price: data.price ?? 0,
      createdAt: data.createdAt ?? new Date(),
      paymentNumber: data.paymentNumber,
      tossPaymentKey: data.tossPaymentKey ?? null,
      approvedAt: data.approvedAt ?? new Date(),
      method: data.method,
      status: data.status as 'DONE' | 'CANCELED',
      orderIds: data.orders.map((order) => order.id),
    };
  }
}
