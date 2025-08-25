export class Product {
  constructor(
    public readonly id: number,
    public readonly thumbnailImage: string,
    public readonly price: number,
    public readonly discountPercent: number,
    public readonly isRecommended: boolean,
    public readonly hit: number,
    public readonly engName: string,
    public readonly korName: string,
    public readonly brand: Brand,
    public readonly categories: Category[] = [],
    public readonly subCategories: SubCategory[] = [],
    public readonly reviewsCount: number = 0,
    public readonly likesCount: number = 0,
    public readonly isSoldOut: boolean = false,
    public readonly isLiked: boolean = false
  ) {}
}

export class Brand {
  constructor(public readonly id: number, public readonly korName: string, public readonly engName: string) {}
}

export class Category {
  constructor(public readonly id: number, public readonly korName: string, public readonly engName: string) {}
}

export class SubCategory {
  constructor(
    public readonly id: number,
    public readonly korName: string,
    public readonly engName: string,
    public readonly categoryId: number
  ) {}
}
