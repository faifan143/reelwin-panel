import { api } from './api';
import { LoginFormData } from '@/types/auth';

export const login = async (data: LoginFormData) => {
  try {
    const response = await api.post('/auth/signin', data);
    return response.data;
  } catch (error) {
    // For development, we'll allow a fake login
    if (process.env.NODE_ENV === 'development') {
      return {
        token: `fake_token_${Date.now()}`,
        user: {
          role: 'admin',
        },
      };
    }
    throw error;
  }
};

export const checkAuth = async (token: string) => {
  try {
    const response = await api.get('/auth/check', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
