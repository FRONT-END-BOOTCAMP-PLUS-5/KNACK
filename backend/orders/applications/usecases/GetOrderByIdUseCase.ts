import { OrderRepository } from "../../domains/repositories/OrderRepository";
import { OrderDto } from "../dtos/GetOrderDto";

export class GetOrderByIdUseCase {
    constructor(private readonly repo: OrderRepository) { }
    execute(id: number, userId: string): Promise<OrderDto | null> {
        return this.repo.findById(id, userId)
    }
}