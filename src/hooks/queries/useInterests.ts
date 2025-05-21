import { useQuery } from '@tanstack/react-query';
import { getAllInterests, getInterestById } from '@/services/interests';

export const useInterests = (enabled = true) => {
  return useQuery({
    queryKey: ['interests'],
    queryFn: getAllInterests,
    enabled,
  });
};

export const useInterestById = (id: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['interests', id],
    queryFn: () => getInterestById(id as string),
    enabled: !!id && enabled,
  });
};