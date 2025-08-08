export class Product {
  constructor(
    public readonly id: number,
    public readonly descriptionText: string | null,
    public readonly thumbnailImage: string,
    public readonly subImages: string[],
    public readonly price: number,
    public readonly discountPercent: number,
    // public readonly detailContents: string | null,
    public readonly brandId: number,
    public readonly categoryId: number,
    public readonly isRecommended: boolean,
    public readonly isPrivate: boolean,
    public readonly createdAt: Date,
    public readonly gender: string | null,
    public readonly hit: number,
    public readonly engName: string,
    public readonly korName: string,
    public readonly modelNumber: string | null,
    public readonly releaseDate: string | null,
    public readonly colorKorName: string,
    public readonly colorEngName: string,
    public readonly brand: Brand,
    public readonly categories: Category[] = [],
    public readonly subCategories: SubCategory[] = [],
    public readonly reviewsCount: number = 0,
    public readonly likesCount: number = 0
  ) {}
}

// TODO: 각 테이블 분리 필요
export class Brand {
  constructor(public readonly id: number, public readonly korName: string, public readonly engName?: string) {}
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
