import { OrderRepository } from "../../domains/repositories/OrderRepository";
import { RepoIndependentOrder } from "@/types/order";

export class GetOrderByIdUseCase {
    constructor(private readonly repo: OrderRepository) { }
    async execute(id: number, userId: string): Promise<RepoIndependentOrder | null> {
        const row = await this.repo.findByIdWithAddress(id, userId);
        if (!row) return null;
        return row;
    }
}