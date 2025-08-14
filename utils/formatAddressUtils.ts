import { AddressDto } from '@/backend/address/applications/dtos/AddressDto';

export const formatFullAddress = (a: AddressDto) => {
  // DTO에서 어떤 키를 쓰는지 모를 수 있으니 안전하게 후보 모두 체크
  const zip =
    (
      a as AddressDto & {
        postalCode?: string;
        postCode?: string;
        zipcode?: string;
        zipCode?: string;
        zonecode?: string;
      }
    ).postalCode ??
    (
      a as AddressDto & {
        postalCode?: string;
        postCode?: string;
        zipcode?: string;
        zipCode?: string;
        zonecode?: string;
      }
    ).postCode ??
    (
      a as AddressDto & {
        postalCode?: string;
        postCode?: string;
        zipcode?: string;
        zipCode?: string;
        zonecode?: string;
      }
    ).zipcode ??
    (
      a as AddressDto & {
        postalCode?: string;
        postCode?: string;
        zipcode?: string;
        zipCode?: string;
        zonecode?: string;
      }
    ).zipCode ??
    (
      a as AddressDto & {
        postalCode?: string;
        postCode?: string;
        zipcode?: string;
        zipCode?: string;
        zonecode?: string;
      }
    ).zonecode ?? // (카카오 주소)
    '';

  const zipPart = zip ? `[${zip}] ` : '';
  const main = a.main ?? '';
  const detail = (a.detail ?? '').trim();
  const detailPart = detail ? ` ${detail}` : '';

  return `${zipPart}${main}${detailPart}`.trim();
};

export const formatAddressDisplay = (a: { zipCode?: string; main: string; detail?: string | null }) =>
  `${a.zipCode ? `[${a.zipCode}] ` : ''}${a.main}${a.detail ? ` ${a.detail}` : ''}`.trim();

// 정규표현식 (010, 011, 016, 017, 018, 019 + 하이픈 있어도 없어도 됨)
export const phonePattern = /^01[016789]-?\d{3,4}-?\d{4}$/;

// 하이픈 포맷 함수
export const formatPhoneNumber = (phone: string): string => {
  // 숫자만 남기기
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    // 01012345678 → 010-1234-5678
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (digits.length === 10) {
    // 0111234567 → 011-123-4567
    return digits.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  }
  return phone; // 형식 안 맞으면 그대로 반환
};
