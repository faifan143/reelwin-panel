
// api.ts
import useStore from '@/store';
import axios from 'axios';
import { Category, CreateCategoryDto, CreateRewardDto, PurchaseRewardDto, Reward, UpdateCategoryDto, UpdateRewardDto, UpdateUserRewardStatusDto, UserReward } from './types';

const API_URL = 'https://anycode-sy.com/reel-win/api';
const { token } = useStore.getState();
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
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

// Categories APIs
export const getCategories = async (activeOnly: boolean = false): Promise<Category[]> => {
    const response = await api.get(`/rewards/categories?activeOnly=${activeOnly}`);
    return response.data;
};

export const getCategory = async (id: string): Promise<Category> => {
    const response = await api.get(`/rewards/categories/${id}`);
    return response.data;
};

export const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
    const response = await api.post('/rewards/categories', data);
    return response.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    const response = await api.put(`/rewards/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await api.delete(`/rewards/categories/${id}`);
};

// Rewards APIs
export const getRewards = async (categoryId?: string, activeOnly: boolean = false): Promise<Reward[]> => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (activeOnly) params.append('activeOnly', 'true');

    const response = await api.get(`/rewards?${params.toString()}`);
    return response.data;
};

export const getReward = async (id: string): Promise<Reward> => {
    const response = await api.get(`/rewards/${id}`);
    return response.data;
};

export const createReward = async (data: CreateRewardDto): Promise<Reward> => {
    const response = await api.post('/rewards', data);
    return response.data;
};

export const updateReward = async (id: string, data: UpdateRewardDto): Promise<Reward> => {
    const response = await api.put(`/rewards/${id}`, data);
    return response.data;
};

export const deleteReward = async (id: string): Promise<void> => {
    await api.delete(`/rewards/${id}`);
};

// User Rewards APIs
export const getUserRewards = async (): Promise<UserReward[]> => {
    const response = await api.get('/rewards/user/purchased');
    return response.data;
};

export const purchaseReward = async (data: PurchaseRewardDto): Promise<any> => {
    const response = await api.post('/rewards/purchase', data);
    return response.data;
};

// Admin User Rewards APIs
export const getAllUserRewards = async (): Promise<UserReward[]> => {
    const response = await api.get('/rewards/admin/purchases');
    return response.data;
};

export const updateUserRewardStatus = async (id: string, data: UpdateUserRewardStatusDto): Promise<UserReward> => {
    const response = await api.put(`/rewards/admin/purchases/${id}/status`, data);
    return response.data;
};
