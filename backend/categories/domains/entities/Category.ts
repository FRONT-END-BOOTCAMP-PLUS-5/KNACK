export class Category {
  constructor(
    public readonly id: number,
    public readonly korName: string,
    public readonly engName: string,
    public readonly subCategories: SubCategory[] = []
  ) {}
}

export class SubCategory {
  constructor(
    public readonly id: number,
    public readonly korName: string,
    public readonly engName: string,
    public readonly categoryId: number
  ) {}
}
