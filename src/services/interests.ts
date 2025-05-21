import { api } from './api';
import { 
  Interest, 
  CreateInterestDto, 
  UpdateInterestDto 
} from '@/types/interests';

export const getAllInterests = async (): Promise<Interest[]> => {
  const response = await api.get('/interests/list');
  return response.data;
};

export const getInterestById = async (id: string): Promise<Interest> => {
  const response = await api.get(`/interests/${id}`);
  return response.data;
};

export const createInterest = async (data: CreateInterestDto): Promise<Interest> => {
  const response = await api.post('/interests', data);
  return response.data;
};

export const updateInterest = async (id: string, data: UpdateInterestDto): Promise<Interest> => {
  const response = await api.patch(`/interests/${id}`, data);
  return response.data;
};

export const deleteInterest = async (id: string): Promise<void> => {
  await api.delete(`/interests/${id}`);
};
