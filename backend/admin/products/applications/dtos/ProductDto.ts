export class ProductDto {
  constructor(
    public id: number,
    public descriptionText: string,
    public thumbnailImage: string,
    public subImages: string,
    public price: number,
    public discountPercent: number,
    public detailContents: string,
    public brandId: number,
    public categoryId: number,
    public isRecommended: boolean,
    public isPrivate: boolean,
    public createdAt: Date,
    public gender: string,
    public hit: number,
    public engName: string,
    public korName: string
  ) {}
}
