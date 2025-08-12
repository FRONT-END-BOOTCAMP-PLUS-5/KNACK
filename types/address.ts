export interface IAddress {
  id: number;
  detail: string;
  isDefault: boolean;
  message: string;
  name: string;
  phone: string;
  address: {
    zipCode: string;
    main: string;
  };
}

export interface IAddressList {
  id: number;
  detail: string;
  isDefault: boolean;
  message: string;
  name: string;
  phone: string;
  zipCode: string;
  main: string;
}

export interface IAddressRef {
  userId: string;
  name: string;
  phone?: string;
  detail?: string;
  message?: string;
  isDefault?: boolean;
  zipCode: string;
  main: string;
}

export interface IUpdateAddress {
  userId: string;
  id: number;
  name: string;
  phone?: string;
  detail?: string;
  message?: string;
  isDefault?: boolean;
  zipCode: string;
  main: string;
}
