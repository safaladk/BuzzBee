import { get } from '@/lib/axios';
import { PlatformStats } from '@/lib/types';

export const statsService = {
  getSummary: () => get<PlatformStats>('/stats/summary'),
};
