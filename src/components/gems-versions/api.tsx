// api.ts
import axios from 'axios';
import { ContentGem, CreateVersionDto, GenerateGemDto, GemResponse, Version, QrCode, CreateQrCodeDto, UpdateQrCodeDto, QrCodeWithScans, PaginatedQrCodesResponse } from './types';
import useStore from '@/store';

const API_URL = 'https://anycode-sy.com/radar/api';
const { token } = useStore.getState()
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token
    },
});

// Add auth token to requests when available
api.interceptors.request.use((config) => {
    const { token } = useStore.getState()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
    // This endpoint is not explicitly mentioned in the provided code,
    // but we'll assume it exists or you might need to create it.
    // The actual implementation might need to be adjusted.
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