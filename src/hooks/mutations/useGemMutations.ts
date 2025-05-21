import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateGem, createVersion, clearVersions } from '@/services/gems';
import { GenerateGemDto, CreateVersionDto } from '@/types/gems';

export const useGenerateGem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: GenerateGemDto) => generateGem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gems'] });
    },
  });
};

export const useCreateVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVersionDto) => createVersion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['version'] });
    },
  });
};

export const useClearVersions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clearVersions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['version'] });
    },
  });
};