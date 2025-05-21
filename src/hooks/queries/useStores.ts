import { useQuery } from '@tanstack/react-query';
import { getAllStores, getStoreById, getAllQrCodes, getQrCodeById } from '@/services/stores';

export const useStores = (enabled = true) => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: getAllStores,
    enabled,
  });
};

export const useStoreById = (id: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: () => getStoreById(id as string),
    enabled: !!id && enabled,
  });
};

export const useQrCodes = (page = 1, limit = 10, enabled = true) => {
  return useQuery({
    queryKey: ['qrcodes', page, limit],
    queryFn: () => getAllQrCodes(page, limit),
    enabled,
  });
};

export const useQrCodeById = (id: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['qrcodes', id],
    queryFn: () => getQrCodeById(id as string),
    enabled: !!id && enabled,
  });
};