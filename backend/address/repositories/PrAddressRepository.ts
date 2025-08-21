import prisma from '@/backend/utils/prisma';
import { AddressRepository } from '../domains/repositories/AddressRepository';
import { CreateAddressDto } from '../applications/dtos/CreateAddressDto';
import { UpdateAddressDto } from '../applications/dtos/UpdateAddressDto';
import { AddressDto } from '../applications/dtos/AddressDto';
import { Prisma } from '@prisma/client';

export class PrAddressRepository implements AddressRepository {
  async save(data: CreateAddressDto): Promise<AddressDto> {
    const existing = await this.findByUserId(data.userId);
    if (existing.length >= 3) {
      throw new Error('배송지는 최대 3개까지만 등록할 수 있습니다.');
    }
    if (data.isDefault) {
      await this.setNonDefaultByUserId(data.userId);
    }

    const created = await prisma.address.create({ data });
    return this.toDto({
      ...created,
      address: {
        zipCode: created.zipCode,
        main: created.main,
      },
    });
  }

  async update(data: UpdateAddressDto): Promise<void> {
    if (data.isDefault !== undefined && data.isDefault === true) {
      const existing = await this.getById(data.id);
      if (existing) {
        await this.setNonDefaultByUserId(existing.userId);
      }
    }

    await prisma.address.update({
      where: { id: data.id },
      data,
    });
  }

  async getById(id: number): Promise<AddressDto | null> {
    const result = await prisma.address.findUnique({ where: { id } });
    return result ? this.toDto({
      ...result,
      address: {
        zipCode: result.zipCode,
        main: result.main,
      },
    }) : null;
  }

  async setNonDefaultByUserId(userId: string): Promise<void> {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  async findByUserId(userId: string): Promise<AddressDto[]> {
    const results = await prisma.address.findMany({ where: { userId } });
    return results.map(result => this.toDto({
      ...result,
      address: {
        zipCode: result.zipCode,
        main: result.main,
      },
    }));
  }

  async setDefault(id: number): Promise<void> {
    const address = await this.getById(id);
    if (!address) return;
    await this.setNonDefaultByUserId(address.userId);
    await prisma.address.update({ where: { id }, data: { isDefault: true } });
  }

  async delete(id: number): Promise<{ id: number; code: string }> {
    try {
      const result = await prisma.address.delete({ where: { id } });

      return { id: result.id, code: '200' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return { id: 0, code: error.code };
      }

      return { id: 0, code: String(error) };
    }
  }

  private toDto(address: AddressDto): AddressDto {
    return {
      id: address.id,
      userId: address.userId,
      name: address.name,
      phone: address.phone,
      address: {
        zipCode: address.address.zipCode,
        main: address.address.main,
      },
      detail: address.detail,
      message: address.message,
      isDefault: address.isDefault,
    };
  }
}
