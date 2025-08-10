export const getIntParam = (searchParams: URLSearchParams, param: string) => {
  const value = searchParams.get(param);
  return value ? parseInt(value) : undefined;
};

export const getBooleanParam = (searchParams: URLSearchParams, param: string) => {
  return searchParams.get(param) === 'true' ? true : false;
};
