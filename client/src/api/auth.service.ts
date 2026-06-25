import { apiClient } from './axios';
import { useAuthStore } from '../store/authStore';

export const AuthService = {
  async register(data: any) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async checkSession() {
    try {
      const response = await apiClient.post('/auth/refresh');
      if (response.data.success) {
        useAuthStore.getState().setAuth(response.data.user, response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      useAuthStore.getState().setLoading(false);
      throw error;
    }
  },

  async login(data: any) {
    const response = await apiClient.post('/auth/login', data);
    if (response.data.success) {
      useAuthStore.getState().setAuth(response.data.user, response.data.accessToken);
    }
    return response.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
    useAuthStore.getState().logout();
  },

  async verifyEmail(token: string) {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: any) {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  }
};
