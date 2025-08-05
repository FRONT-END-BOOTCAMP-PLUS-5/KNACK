export class Product {
  constructor(
    public id: number | null,
    public description_text: string | null,
    public thumbnail_image: string | null,
    public sub_images: string | null,
    public price: number | null,
    public discount_percent: number | null,
    public detail_contents: string | null,
    public brand_id: number | null,
    public category_id: number | null,
    public is_recommended: boolean | null,
    public is_private: boolean | null,
    public created_at: Date,
    public gender: string,
    public hit: number | null,
    public eng_name: string | null,
    public kor_name: string | null
  ) {}
}
