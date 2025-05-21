import { api } from './api';
import { Content, ContentFormData, SearchFilters } from '@/types/content';

export const getContentList = async (filters: SearchFilters = {}) => {
  const params = new URLSearchParams();
  
  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value as string);
  });
  
  const response = await api.get(`/content?${params.toString()}`);
  return response.data as Content[];
};

export const getContentById = async (id: string) => {
  const response = await api.get(`/content/${id}`);
  return response.data as Content;
};

export const createContent = async (data: ContentFormData) => {
  const response = await api.post('/content', data);
  return response.data as Content;
};

export const updateContent = async (id: string, data: Partial<ContentFormData>) => {
  // Prepare the data based on the owner type
  const { ownerType, ownerName, ownerNumber, storeId, ...otherData } = data;

  const updateData: any = {
    ...otherData,
  };

  if (ownerType) {
    updateData.ownerType = ownerType;
    
    if (ownerType === "INDIVIDUAL") {
      if (ownerName) updateData.ownerName = ownerName;
      if (ownerNumber) updateData.ownerNumber = ownerNumber;
    } else if (ownerType === "STORE") {
      if (storeId) updateData.storeId = storeId;
    }
  }

  const response = await api.patch(`/content/${id}`, updateData);
  return response.data as Content;
};

export const deleteContent = async (id: string) => {
  const response = await api.delete(`/content/${id}`);
  return response.data;
};
