import requester from '@/utils/requester';
import { IOption } from '@/types/option';

export const optionsService = {
  getOptions: async (): Promise<IOption[]> => {
    const { data, error } = await requester.get<{ result: IOption[] }>(`/api/options`).catch((error) => error);

    if (error) throw new Error(error.message);

    return data;
  },
};
