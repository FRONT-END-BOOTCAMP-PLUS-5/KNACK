export class Cart {
  constructor(
    public id: number,
    public userId: string,
    public productId: number,
    public optionMappingId: number,
    public createdAt: Date | null,
    public count: number | null
  ) {}
}
