const parseNumberRange = (priceString?: string): { min?: number; max?: number } => {
  const match = priceString?.match(/^(\d+)?-?(\d+)?$/);
  if (!match) return {};

  const [_, minVal, maxVal] = match;
  return {
    ...(minVal ? { min: parseInt(minVal, 10) } : {}),
    ...(maxVal ? { max: parseInt(maxVal, 10) } : {}),
  };
};

const stringifyNumberRange = (min: number, max: number): string => {
  return `${min}-${max}`;
};

export { parseNumberRange, stringifyNumberRange };
