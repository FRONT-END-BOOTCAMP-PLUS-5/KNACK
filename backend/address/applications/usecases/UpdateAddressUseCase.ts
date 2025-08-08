import { AddressRepository } from '../../domains/repositories/AddressRepository'
import { UpdateAddressDto } from '../dtos/UpdateAddressDto'

export class UpdateAddressUseCase {
    constructor(private readonly repo: AddressRepository) { }

    async execute(dto: UpdateAddressDto): Promise<void> {
        await this.repo.update(dto)
    }
}