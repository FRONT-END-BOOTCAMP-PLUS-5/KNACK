export interface CartRepository {
  insertCart(): Promise<number>;
}
