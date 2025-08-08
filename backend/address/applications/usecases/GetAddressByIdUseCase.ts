import { AddressRepository } from '../../domains/repositories/AddressRepository'
import { AddressDto } from '../dtos/AddressDto'

export class GetAddressByIdUseCase {
  constructor(private readonly repo: AddressRepository) { }

  async execute(id: number): Promise<AddressDto | null> {
    return this.repo.getById(id)
  }
}