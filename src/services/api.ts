import axios from 'axios';
import useStore from '@/store';

const API_URL = 'https://anycode-sy.com/radar/api';

// Create base axios instance
export const createApiInstance = () => {
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests when available
  api.interceptors.request.use((config) => {
    const { token } = useStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const api = createApiInstance();
