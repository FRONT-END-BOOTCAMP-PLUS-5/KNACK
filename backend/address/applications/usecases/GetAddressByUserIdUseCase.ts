import { AddressRepository } from '../../domains/repositories/AddressRepository'
import { AddressDto } from '../dtos/AddressDto'

export class GetAddressByUserIdUseCase {
    constructor(private readonly repo: AddressRepository) { }

    async execute(userId: string): Promise<AddressDto[]> {
        return this.repo.findByUserId(userId)
    }
}
