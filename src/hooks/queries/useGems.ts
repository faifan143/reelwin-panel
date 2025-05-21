import { useQuery } from '@tanstack/react-query';
import { getAllGems, getLatestVersion } from '@/services/gems';

export const useGems = (enabled = true) => {
  return useQuery({
    queryKey: ['gems'],
    queryFn: getAllGems,
    enabled,
  });
};

export const useLatestVersion = (enabled = true) => {
  return useQuery({
    queryKey: ['version'],
    queryFn: getLatestVersion,
    enabled,
  });
};