import { api } from './api';
import { 
  Store, 
  CreateStoreDto,
  UpdateStoreDto,
  QrCode,
  QrCodeWithScans,
  CreateQrCodeDto,
  UpdateQrCodeDto,
  PaginatedQrCodesResponse
} from '@/types/stores';

// Store APIs
export const getAllStores = async (): Promise<Store[]> => {
  const response = await api.get('/stores');
  return response.data;
};

export const getStoreById = async (id: string): Promise<Store> => {
  const response = await api.get(`/stores/${id}`);
  return response.data;
};

export const createStore = async (data: CreateStoreDto): Promise<Store> => {
  const response = await api.post('/stores', data);
  return response.data;
};

export const updateStore = async (id: string, data: UpdateStoreDto): Promise<Store> => {
  const response = await api.patch(`/stores/${id}`, data);
  return response.data;
};

export const deleteStore = async (id: string): Promise<void> => {
  await api.delete(`/stores/${id}`);
};

// QR Code APIs
export const getAllQrCodes = async (page: number = 1, limit: number = 10): Promise<PaginatedQrCodesResponse> => {
  const response = await api.get(`/qr/admin?page=${page}&limit=${limit}`);
  return response.data;
};

export const getQrCodeById = async (id: string): Promise<QrCodeWithScans> => {
  const response = await api.get(`/qr/admin/${id}`);
  return response.data;
};

export const createQrCode = async (data: CreateQrCodeDto): Promise<QrCode> => {
  const response = await api.post('/qr', data);
  return response.data;
};

export const updateQrCode = async (id: string, data: UpdateQrCodeDto): Promise<QrCode> => {
  const response = await api.patch(`/qr/${id}`, data);
  return response.data;
};

export const activateQrCode = async (id: string): Promise<QrCode> => {
  const response = await api.patch(`/qr/${id}/status/activate`, {});
  return response.data;
};

export const deactivateQrCode = async (id: string): Promise<QrCode> => {
  const response = await api.patch(`/qr/${id}/status/deactivate`, {});
  return response.data;
};

export const deleteQrCode = async (id: string): Promise<void> => {
  await api.delete(`/qr/${id}`);
};

export const selectRandomWinner = async (id: string): Promise<{ winner: any }> => {
  const response = await api.get(`/qr/${id}/lottery`);
  return response.data;
};

export const generateQrCodePdf = async (id: string): Promise<Blob> => {
  const response = await api.get(`/qr/${id}/pdf`, {
    responseType: 'blob'
  });
  return response.data;
};