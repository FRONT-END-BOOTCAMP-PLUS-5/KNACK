export class PriceParser {
  static parse(priceString?: string): { min?: number; max?: number } {
    const match = priceString?.match(/^(\d+)?-?(\d+)?$/);
    if (!match) return {};

    const [_, minVal, maxVal] = match;
    return {
      ...(minVal ? { min: parseInt(minVal) } : {}),
      ...(maxVal ? { max: parseInt(maxVal) } : {}),
    };
  }
}
