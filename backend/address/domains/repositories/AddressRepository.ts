import { CreateAddressDto } from '../../applications/dtos/CreateAddressDto'
import { UpdateAddressDto } from '../../applications/dtos/UpdateAddressDto'
import { Address } from '../entities/Address'

export interface AddressRepository {
    save(data: CreateAddressDto): Promise<Address>
    update(data: UpdateAddressDto): Promise<void>
    getById(id: number): Promise<Address | null>
    setNonDefaultByUserId(userId: string): Promise<void>
    findByUserId(userId: string): Promise<Address[]>
    setDefault(id: number): Promise<void>
    delete(id: number): Promise<void>
}