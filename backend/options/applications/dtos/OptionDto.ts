export interface OptionValueDto {
  id: number;
  name: string;
  typeId: number;
}

export interface OptionDto {
  id: number;
  name: string;
  optionValues: OptionValueDto[];
}
