import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createStore,
  updateStore,
  deleteStore,
  createQrCode,
  updateQrCode,
  activateQrCode,
  deactivateQrCode,
  deleteQrCode,
} from '@/services/stores';
import { CreateStoreDto, UpdateStoreDto, CreateQrCodeDto, UpdateQrCodeDto } from '@/types/stores';

// Store mutations
export const useCreateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStoreDto) => createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreDto }) => 
      updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
};

// QR Code mutations
export const useCreateQrCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateQrCodeDto) => createQrCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
  });
};

export const useUpdateQrCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQrCodeDto }) => 
      updateQrCode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
  });
};

export const useActivateQrCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => activateQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
  });
};

export const useDeactivateQrCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deactivateQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
  });
};

export const useDeleteQrCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteQrCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    },
  });
};