// Authentication service for the content management system
import { User } from './database';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'editor' | 'contributor';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: Permission[];
}

export interface Permission {
  action: string;
  resource: string;
  conditions?: object;
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    { action: '*', resource: '*' }, // Full access
  ],
  editor: [
    { action: 'read', resource: 'content' },
    { action: 'create', resource: 'content' },
    { action: 'update', resource: 'content' },
    { action: 'delete', resource: 'content', conditions: { authorId: 'self' } },
    { action: 'read', resource: 'ideas' },
    { action: 'create', resource: 'ideas' },
    { action: 'update', resource: 'ideas' },
    { action: 'read', resource: 'analytics' },
    { action: 'read', resource: 'users' },
    { action: 'update', resource: 'users', conditions: { userId: 'self' } },
  ],
  contributor: [
    { action: 'read', resource: 'content' },
    { action: 'create', resource: 'content' },
    { action: 'update', resource: 'content', conditions: { authorId: 'self' } },
    { action: 'read', resource: 'ideas' },
    { action: 'create', resource: 'ideas' },
    { action: 'update', resource: 'ideas', conditions: { authorId: 'self' } },
    { action: 'read', resource: 'analytics', conditions: { authorId: 'self' } },
    { action: 'update', resource: 'users', conditions: { userId: 'self' } },
  ]
};

export class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  // Mock users for development (replace with real auth service)
  private mockUsers: (User & { password: string })[] = [
    {
      id: 'user-1',
      email: 'admin@company.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    },
    {
      id: 'user-2',
      email: 'editor@company.com',
      password: 'editor123',
      name: 'John Editor',
      role: 'editor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    },
    {
      id: 'user-3',
      email: 'contributor@company.com',
      password: 'contributor123',
      name: 'Jane Contributor',
      role: 'contributor',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
  ];

  constructor() {
    // Check for existing session on initialization
    this.initializeAuth();
  }

  private initializeAuth() {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        this.token = storedToken;
        this.currentUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        this.clearAuth();
      }
    }
  }

  private clearAuth() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  private generateToken(user: User): string {
    // In a real app, this would be a JWT token from the backend
    return btoa(`${user.id}:${Date.now()}`);
  }

  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;
    const authenticatedUser = {
      ...userWithoutPassword,
      lastActive: new Date().toISOString()
    };

    this.currentUser = authenticatedUser;
    this.token = this.generateToken(authenticatedUser);

    // Store in localStorage for persistence
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));

    return authenticatedUser;
  }

  async register(data: RegisterData): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    if (this.mockUsers.some(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role || 'contributor',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    this.mockUsers.push(newUser);

    // Remove password and return user
    const { password, ...userWithoutPassword } = newUser;
    const authenticatedUser = userWithoutPassword;

    this.currentUser = authenticatedUser;
    this.token = this.generateToken(authenticatedUser);

    // Store in localStorage for persistence
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));

    return authenticatedUser;
  }

  async logout(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    this.clearAuth();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null;
  }

  getUserPermissions(user?: User): Permission[] {
    const targetUser = user || this.currentUser;
    if (!targetUser) return [];
    
    return ROLE_PERMISSIONS[targetUser.role] || [];
  }

  hasPermission(
    action: string, 
    resource: string, 
    context?: { userId?: string; authorId?: string }
  ): boolean {
    if (!this.currentUser) return false;

    const permissions = this.getUserPermissions();
    
    // Check for wildcard admin permission
    if (permissions.some(p => p.action === '*' && p.resource === '*')) {
      return true;
    }

    // Check for specific permission
    const permission = permissions.find(p => 
      (p.action === action || p.action === '*') && 
      (p.resource === resource || p.resource === '*')
    );

    if (!permission) return false;

    // Check conditions if they exist
    if (permission.conditions && context) {
      const conditions = permission.conditions as any;
      
      if (conditions.userId === 'self' && context.userId !== this.currentUser.id) {
        return false;
      }
      
      if (conditions.authorId === 'self' && context.authorId !== this.currentUser.id) {
        return false;
      }
    }

    return true;
  }

  canEdit(item: { authorId?: string }): boolean {
    return this.hasPermission('update', 'content', { authorId: item.authorId });
  }

  canDelete(item: { authorId?: string }): boolean {
    return this.hasPermission('delete', 'content', { authorId: item.authorId });
  }

  canManageUsers(): boolean {
    return this.hasPermission('*', 'users');
  }

  canViewAnalytics(authorId?: string): boolean {
    return this.hasPermission('read', 'analytics', { authorId });
  }

  async refreshToken(): Promise<string | null> {
    // In a real app, this would refresh the JWT token
    if (this.currentUser) {
      this.token = this.generateToken(this.currentUser);
      localStorage.setItem('auth_token', this.token);
      return this.token;
    }
    return null;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('Not authenticated');
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = {
      ...this.currentUser,
      ...updates,
      id: this.currentUser.id, // Prevent ID changes
      lastActive: new Date().toISOString()
    };

    this.currentUser = updatedUser;
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));

    // Update mock data
    const userIndex = this.mockUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...updates };
    }

    return updatedUser;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@company.com', password: 'admin123' },
  editor: { email: 'editor@company.com', password: 'editor123' },
  contributor: { email: 'contributor@company.com', password: 'contributor123' }
};
