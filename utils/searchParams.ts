export const getIntParam = (searchParams: URLSearchParams, param: string) => {
  const value = searchParams.get(param);
  return value ? parseInt(value) : undefined;
};

export const getIntArrayParam = (searchParams: URLSearchParams, param: string) => {
  const value = searchParams.get(param);
  if (!value) return undefined;

  return value
    .split(',')
    .map((item) => parseInt(item.trim()))
    .filter((num) => !isNaN(num));
};

export const getStringArrayParam = (searchParams: URLSearchParams, param: string) => {
  const value = searchParams.get(param);
  if (!value) return undefined;

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export const getBooleanParam = (searchParams: URLSearchParams, param: string) => {
  return searchParams.get(param) === 'true' ? true : false;
};
