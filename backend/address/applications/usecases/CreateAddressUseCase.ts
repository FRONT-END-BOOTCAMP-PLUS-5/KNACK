import { AddressRepository } from "../../domains/repositories/AddressRepository";
import { CreateAddressDto } from "../dtos/CreateAddressDto";

export class CreateAddressUseCase {
    constructor(private readonly repo: AddressRepository) { }

    async execute(dto: CreateAddressDto) {
        return await this.repo.save(dto)
    }
}