import { Option } from '../../domains/entities/Option';
import { OptionRepository } from '../../domains/repositories/OptionRepository';

export class GetOptionUseCase {
  private repository: OptionRepository;

  constructor(repository: OptionRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Option[]> {
    const result = await this.repository.getOptions();

    const filteredOptions = result.filter((option) => option.name !== '색상');

    return filteredOptions;
  }
}
