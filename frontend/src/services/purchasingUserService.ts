// src/services/purchasingUserService.ts
import api from '../api/api'; // axios instance

export interface PurchasingUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePurchasingUserData {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface UpdatePurchasingUserData {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const purchasingUserService = {

    //    ===== Purchasing User AUTH


     // ✅ Register
  async register(data: RegisterData): Promise<{ message: string; user: PurchasingUser }> {
    try {
      const response = await api.post('/purchasing-auth/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Error registering purchasing user:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Login
  async login(data: LoginData): Promise<{ message: string; user: PurchasingUser }> {
    try {
      const response = await api.post('/purchasing-auth/login', data, {
        withCredentials: true, // 👈 important for cookie-based auth
      });
      return response.data;
    } catch (error: any) {
      console.error('Error logging in purchasing user:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Logout
  async logout(): Promise<{ message: string }> {
    try {
      const response = await api.post('/purchasing-auth/logout', {}, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      console.error('Error logging out purchasing user:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Get profile
  async getProfile(): Promise<PurchasingUser> {
    try {
      const response = await api.get('/purchasing-auth/profile', {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Edit profile
  async editProfile(data: Partial<PurchasingUser>): Promise<PurchasingUser> {
    try {
      const response = await api.put('/purchasing-auth/edit-profile', data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error editing profile:', error.response?.data || error.message);
      throw error;
    }
  },


//   ===== Purchasing User Crud

  // ✅ Create or get existing user
  async createOrGetUser(data: CreatePurchasingUserData): Promise<PurchasingUser> {
    try {
      const response = await api.post('/purchasing-users', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating/fetching purchasing user:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Fetch all users
  async getAllUsers(): Promise<PurchasingUser[]> {
    try {
      const response = await api.get('/purchasing-users/all');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching purchasing users:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Find user (by id, email, or phone)
  async findUser(query: { id?: string; email?: string; phoneNumber?: string }): Promise<PurchasingUser> {
    try {
      const response = await api.get('/purchasing-users', { params: query });
      return response.data;
    } catch (error: any) {
      console.error('Error finding purchasing user:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Update user
  async updateUser(id: string, data: UpdatePurchasingUserData): Promise<PurchasingUser> {
    try {
      const response = await api.patch(`/purchasing-users/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating purchasing user:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default purchasingUserService;
