import { HideHeaderPath } from '@/types/header';
import { HIDE_HEADER_PATHS } from '@/constraint/header';

export const shouldHideHeader = (pathname: string): boolean => {
  return HIDE_HEADER_PATHS.some(path => pathname.startsWith(path));
}; 