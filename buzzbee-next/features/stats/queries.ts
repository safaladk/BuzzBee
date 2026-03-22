import { useQuery } from '@tanstack/react-query';
import { statsService } from './services';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats', 'summary'],
    queryFn: statsService.getSummary,
  });
};
