export interface UserPointsRepository {
    getAvailablePoints(userId: string): Promise<number>;
}