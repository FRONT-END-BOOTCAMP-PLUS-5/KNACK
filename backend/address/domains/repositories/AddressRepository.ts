import { CreateAddressDto } from '../../applications/dtos/CreateAddressDto';
import { UpdateAddressDto } from '../../applications/dtos/UpdateAddressDto';
import { AddressDto } from '../../applications/dtos/AddressDto';

export interface AddressRepository {
  save(data: CreateAddressDto): Promise<AddressDto>;
  update(data: UpdateAddressDto): Promise<void>;
  getById(id: number): Promise<AddressDto | null>;
  setNonDefaultByUserId(userId: string): Promise<void>;
  findByUserId(userId: string): Promise<AddressDto[]>;
  setDefault(id: number): Promise<void>;
  delete(id: number): Promise<{ id: number; code: string }>;
}
