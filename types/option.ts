interface IOptionValue {
  id: number;
  name: string;
  typeId: number;
}

export interface IOption {
  id: number;
  name: string;
  optionValues: IOptionValue[];
}
