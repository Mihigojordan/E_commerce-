/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import purchasingUserService, {
  type PurchasingUser,
  type LoginData,
  type RegisterData,
} from '../services/purchasingUserService';

export interface PurchasingUserAuthContextType {
  user: PurchasingUser | null;
  login: (data: LoginData) => Promise<PurchasingUser>;
  register: (data: RegisterData) => Promise<PurchasingUser>;
  logout: () => Promise<unknown>;
  updateProfile: (updates: Partial<PurchasingUser>) => Promise<PurchasingUser>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const PurchasingUserAuthContext =
  createContext<PurchasingUserAuthContextType>({
    user: null,
    login: () => Promise.resolve({} as PurchasingUser),
    register: () => Promise.resolve({} as PurchasingUser),
    logout: () => Promise.resolve(),
    updateProfile: () => Promise.resolve({} as PurchasingUser),
    isAuthenticated: false,
    isLoading: true,
  });

interface AuthState {
  user: PurchasingUser | null;
  isAuthenticated: boolean;
}

interface PurchasingUserAuthProviderProps {
  children: ReactNode;
}

export const PurchasingUserAuthProvider: React.FC<
  PurchasingUserAuthProviderProps
> = ({ children }) => {
  const [user, setUser] = useState<PurchasingUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthState = (authData: AuthState) => {
    setUser(authData.user);
    setIsAuthenticated(authData.isAuthenticated);
  };

  // ✅ Register
  const register = async (data: RegisterData): Promise<PurchasingUser> => {
    try {
      const response = await purchasingUserService.register(data);
      updateAuthState({ user: null, isAuthenticated: false });
      return response.user;
    } catch (error: any) {
      throw new Error(error?.response?.data.message || error.message);
    }
  };

  // ✅ Login
  const login = async (data: LoginData): Promise<PurchasingUser> => {
    try {
      const response = await purchasingUserService.login(data);
      updateAuthState({ user: response.user, isAuthenticated: true });
      return response.user;
    } catch (error: any) {
      throw new Error(error?.response?.data.message || error.message);
    }
  };

  // ✅ Logout
  const logout = async (): Promise<unknown> => {
    try {
      const response = await purchasingUserService.logout();
      updateAuthState({ user: null, isAuthenticated: false });
      return response;
    } catch (error: any) {
      updateAuthState({ user: null, isAuthenticated: false });
      throw new Error(error.message);
    }
  };

  // ✅ Update profile
  const updateProfile = async (
    updates: Partial<PurchasingUser>
  ): Promise<PurchasingUser> => {
    try {
      const updatedUser = await purchasingUserService.editProfile(updates);
      updateAuthState({ user: updatedUser, isAuthenticated: true });
      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // ✅ Check session
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const userProfile = await purchasingUserService.getProfile();
      if (userProfile) {
        updateAuthState({ user: userProfile, isAuthenticated: true });
      } else {
        updateAuthState({ user: null, isAuthenticated: false });
      }
    } catch {
      updateAuthState({ user: null, isAuthenticated: false });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const values: PurchasingUserAuthContextType = {
    login,
    register,
    logout,
    updateProfile,
    user,
    isLoading,
    isAuthenticated,
  };

  return (
    <PurchasingUserAuthContext.Provider value={values}>
      {children}
    </PurchasingUserAuthContext.Provider>
  );
};

// ✅ Hook
export default function usePurchasingUserAuth(): PurchasingUserAuthContextType {
  const context = useContext(PurchasingUserAuthContext);
  if (!context) {
    throw new Error(
      'usePurchasingUserAuth must be used within PurchasingUserAuthProvider'
    );
  }
  return context;
}
