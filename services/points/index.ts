import axios from 'axios';

export const pointsService = {
  creditPoints: async (amount: number, reason: string = 'FISHING_EVENT') => {
    const response = await axios.post('/api/points', {
      action: 'credit',
      amount,
      reason,
    });

    return response.data;
  },
};
