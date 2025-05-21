import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInterest,
  updateInterest,
  deleteInterest
} from '@/services/interests';
import { CreateInterestDto, UpdateInterestDto } from '@/types/interests';

export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInterestDto) => createInterest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });
};

export const useUpdateInterest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInterestDto }) => 
      updateInterest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });
};

export const useDeleteInterest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteInterest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });
};