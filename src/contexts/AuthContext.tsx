import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, RegisterData, Permission } from '../services/auth';
import { User } from '../services/database';

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: Permission[];

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;

  // Permission helpers
  hasPermission: (action: string, resource: string, context?: object) => boolean;
  canEdit: (item: { authorId?: string }) => boolean;
  canDelete: (item: { authorId?: string }) => boolean;
  canManageUsers: () => boolean;
  canViewAnalytics: (authorId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Calculate permissions whenever user changes
  const permissions = user ? authService.getUserPermissions(user) : [];

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authenticatedUser = await authService.login(credentials);
      setUser(authenticatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newUser = await authService.register(data);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Permission helper methods
  const hasPermission = (action: string, resource: string, context?: object) => {
    return authService.hasPermission(action, resource, context);
  };

  const canEdit = (item: { authorId?: string }) => {
    return authService.canEdit(item);
  };

  const canDelete = (item: { authorId?: string }) => {
    return authService.canDelete(item);
  };

  const canManageUsers = () => {
    return authService.canManageUsers();
  };

  const canViewAnalytics = (authorId?: string) => {
    return authService.canViewAnalytics(authorId);
  };

  const value: AuthContextType = {
    // State
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    permissions,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    clearError,

    // Permission helpers
    hasPermission,
    canEdit,
    canDelete,
    canManageUsers,
    canViewAnalytics
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Convenience hooks
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

export const usePermissions = () => {
  const { permissions, hasPermission, canEdit, canDelete, canManageUsers, canViewAnalytics } = useAuth();
  return { permissions, hasPermission, canEdit, canDelete, canManageUsers, canViewAnalytics };
};

export const useAuthActions = () => {
  const { login, register, logout, updateProfile } = useAuth();
  return { login, register, logout, updateProfile };
};
