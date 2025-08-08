import { GetProductUseCase } from '@/backend/products/applications/usecases/GetProductUseCase';
import { PrProductRepository } from '@/backend/products/repositories/PrProductsRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const id = Number(searchParams.get('id')) || 0;

  try {
    const productRepository = new PrProductRepository();
    const product = await new GetProductUseCase(productRepository).execute(id);

    return NextResponse.json({ result: product, status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message, status: 503 });
    }
  }
}

/**
 * 벌크 조회
 * @param req
 * @returns product[]
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const ids = Array.isArray(body?.ids) ? body.ids : null
    if (!ids) {
      return NextResponse.json({ message: 'ids (number[]) is required' }, { status: 400 })
    }

    // 1) 파싱/검증
    const parsed: number[] = ids
      .map((v: number) => Number(v))
      .filter((n: number) => Number.isInteger(n) && n > 0)

    if (parsed.length !== ids.length) {
      return NextResponse.json({ message: 'ids must be positive integers' }, { status: 400 })
    }

    // 중복 제거 (DB부하 감소), 요청 순서는 따로 보존할 거라 OK
    const unique = [...new Set(parsed)]

    // 안전장치: 한번에 너무 많이 받지 않도록 제한 (필요시 조정)
    const MAX_IDS = 100
    if (unique.length === 0) {
      return NextResponse.json({ message: 'ids is empty' }, { status: 400 })
    }
    if (unique.length > MAX_IDS) {
      return NextResponse.json({ message: `Too many ids (max ${MAX_IDS})` }, { status: 413 })
    }

    // 2) 조회
    const repo = new PrProductRepository()
    const rows = await repo.findManyByIds(unique as number[]) // 내부에서 WHERE id IN (...)

    // 3) 요청 순서 보존 + notFound 도출
    const map = new Map(rows.map((p) => [p.id, p]))
    const results = parsed.map((id) => map.get(id) ?? null)
    const notFound = unique.filter((id) => !map.has(id))

    // 4) 응답 (필요하면 select로 필드 최소화하도록 repository 수정 권장)
    return NextResponse.json(
      { results, notFound },
      {
        status: 200,
        // 캐시 정책은 상황에 맞게: 재고/가격 변동 잦으면 no-store 권장
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  } catch (err) {
    console.error('products/batch error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
