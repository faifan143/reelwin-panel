import { api } from './api';
import { 
  ContentGem, 
  CreateVersionDto, 
  GenerateGemDto, 
  GemResponse, 
  Version
} from '@/types/gems';

// Gems APIs
export const generateGem = async (data: GenerateGemDto): Promise<GemResponse> => {
  const { points, contentId } = data;
  let url = `/content/generate-gem`;

  // Create a params object instead of building URL manually
  const params: Record<string, any> = {
    points: points
  };

  if (contentId) {
    params.contentId = contentId;
  }

  // Pass an empty object as data and the params in the config object
  const response = await api.post(url, {}, { params });
  return response.data;
};

export const getAllGems = async (): Promise<ContentGem[]> => {
  const response = await api.get('/content/gems');
  return response.data;
};

// Version APIs
export const createVersion = async (data: CreateVersionDto): Promise<Version> => {
  const response = await api.post('/users/add-update', data);
  return response.data;
};

export const clearVersions = async (): Promise<void> => {
  const response = await api.post('/users/clear-update');
  return response.data;
};

export const getLatestVersion = async (): Promise<Version> => {
  const response = await api.get('/users/check-update');
  return response.data;
};
