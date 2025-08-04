export interface ProductRepository {
  insertProduct(): Promise<number>;
}
