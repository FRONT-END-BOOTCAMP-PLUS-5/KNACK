import prisma from '@/backend/utils/prisma';
import { OptionRepository } from '../domains/repositories/OptionRepository';
import { Option, OptionValue } from '../domains/entities/Option';

export class PrOptionRepository implements OptionRepository {
  async getOptions(): Promise<Option[]> {
    const optionTypes = await prisma.optionType.findMany({
      where: {
        isPrivate: true,
      },
      include: {
        optionValue: {
          where: {
            isPrivate: true,
          },
        },
      },
    });

    return optionTypes.map(
      (optionType) =>
        new Option(
          optionType.id,
          optionType.name,
          optionType.optionValue.map((optionValue) => new OptionValue(optionValue.id, optionValue.name, optionType.id))
        )
    );
  }
}
