import { Option } from '../entities/Option';

export interface OptionRepository {
  getOptions(): Promise<Option[]>;
}
