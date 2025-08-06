import { AddressRepository } from "../../domains/repositories/AddressRepository";

export class DeleteAddressUseCase {
    constructor(private readonly repo: AddressRepository) { }

    async execute(id: number): Promise<void> {
        await this.repo.delete(id)
    }
}