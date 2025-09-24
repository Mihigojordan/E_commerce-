/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../api/api';
import type { AxiosInstance, AxiosResponse } from 'axios';

interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  names: string;
  email: string;
  phone?: string;
  role: Role;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  admin: User | null;
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
  };
}

interface LoginData {
  email: string; // can be email or phone for admin login, email for regular login
  password: string;
}

class AuthService {
  private api: AxiosInstance = api;

  /**
   * Login user (admin or regular)
   * For admin, maps 'email' to 'email' for backend
   */
async login(loginData: LoginData, isAdmin = false): Promise<User> {
  const response = await this.api.post<AuthResponse>(
    isAdmin ? "/auth/login" : "/auth/login",
    loginData,
    { withCredentials: true }
  );

  if (!response.data.admin) {
    throw new Error("Login failed: no user returned");
  }

  return response.data.admin;
}

async getProfile(isAdmin = false): Promise<User | null> {
  try {
    const response = await this.api.get<User>(
      isAdmin ? "/auth/profile" : "/auth/profile",
      { withCredentials: true }
    );
    console.log(response.data);
    
    return response.data; // backend returns user directly
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 404) return null;
    throw error;
  }
}


  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>, isAdmin: boolean = false): Promise<User> {
    try {
      const response: AxiosResponse<{ success: boolean; data: { user: User } }> =
        await this.api.put(isAdmin ? '/auth/profile' : '/auth/profile', updates);

      return response.data.data.user;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        `Failed to update ${isAdmin ? 'admin' : 'user'} profile`;
      throw new Error(msg);
    }
  }

  /**
   * Change password
   */
  async changePassword(current_password: string, new_password: string): Promise<string> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> =
        await this.api.put('/auth/change-password', { current_password, new_password });

      return response.data.message;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to change password';
      throw new Error(msg);
    }
  }

  /**
   * Reset password (request reset link)
   */
  async resetPassword(email: string): Promise<string> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> =
        await this.api.post('/auth/reset-password', { email });

      return response.data.message;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to reset password';
      throw new Error(msg);
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<string> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> =
        await this.api.delete('/auth/delete-account', {
          data: { password },
        });

      return response.data.message;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete account';
      throw new Error(msg);
    }
  }

  /**
   * Logout
   */
  async logout(isAdmin: boolean = false): Promise<string> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> =
        await this.api.post(isAdmin ? '/auth/admin/logout' : '/auth/logout', {});

      return response.data.message;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        `Failed to logout ${isAdmin ? 'admin' : 'user'}`;
      throw new Error(msg);
    }
  }
}

const authService = new AuthService();
export default authService;
export const { login, getProfile, updateProfile, changePassword, resetPassword, deleteAccount, logout } = authService;