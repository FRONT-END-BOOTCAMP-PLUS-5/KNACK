export class Brand {
  constructor(
    public readonly id: number,
    public readonly korName: string,
    public readonly engName: string,
    public readonly logoImage: string,
    public readonly likesCount: number
  ) {}
}
