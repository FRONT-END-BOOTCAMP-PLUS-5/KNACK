import { IAddress, IAddressList, IAddressRef, IUpdateAddress } from '@/types/address';

export const updateAddressConversion = (data: IAddress, userId?: string) => {
  const conversion: IUpdateAddress = {
    id: data?.id,
    detail: data?.detail,
    isDefault: data?.isDefault,
    main: data?.address?.main,
    zipCode: data?.address?.zipCode,
    message: data?.message,
    name: data?.name,
    phone: data?.phone,
    userId: userId ?? '',
  };

  return conversion;
};

export const addAddressConversion = (data: IAddress, userId?: string) => {
  const conversion: IAddressRef = {
    userId: userId ?? '',
    detail: data?.detail,
    isDefault: data?.isDefault,
    message: data?.message,
    name: data?.name,
    phone: data?.phone,
    main: data?.address?.main,
    zipCode: data?.address?.zipCode,
  };

  return conversion;
};

export const addressListMapper = async (data: IAddress[]) => {
  const mapper: IAddress[] = await data?.map((item) => {
    return {
      id: item?.id,
      detail: item?.detail,
      isDefault: item?.isDefault,
      name: item?.name,
      phone: item?.phone,
      address: {
        zipCode: item?.address?.zipCode,
        main: item?.address?.main,
      },
      message: '',
    };
  });

  return mapper;
};
