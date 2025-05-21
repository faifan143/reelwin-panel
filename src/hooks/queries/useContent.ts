import { useQuery } from '@tanstack/react-query';
import { getContentList, getContentById } from '@/services/content';
import { SearchFilters } from '@/types/content';

export const useContentList = (filters: SearchFilters = {}, enabled = true) => {
  return useQuery({
    queryKey: ['content', filters],
    queryFn: () => getContentList(filters),
    enabled,
  });
};

export const useContentById = (id: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => getContentById(id as string),
    enabled: !!id && enabled,
  });
};