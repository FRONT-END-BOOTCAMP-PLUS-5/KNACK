import { GetProductsThumbnailUseCase } from '@/backend/products/applications/usecases/GetProductsThumbnail';
import { PrProductRepository } from '@/backend/products/repositories/PrProductsRepository';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const productRepository = new PrProductRepository();
    const products = await new GetProductsThumbnailUseCase(productRepository).execute();
    const thumbnailPromise = products?.map(async (item) => {
      const imageResponse = await fetch(item.thumbnailImage);

      const arrayBuffer = await imageResponse.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const base64String = imageBuffer.toString('base64');

      return [
        {
          inlineData: {
            data: base64String,
            mimeType: 'image/webp',
          },
        },
        {
          text: `${item?.id}`,
        },
      ];
    });

    const base64Image = await Promise.all(thumbnailPromise ?? []);

    return NextResponse.json({ result: base64Image, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}
