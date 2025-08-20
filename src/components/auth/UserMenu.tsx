import React, { useState } from 'react';
import { User, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50';
      case 'editor':
        return 'text-blue-600 bg-blue-50';
      case 'contributor':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'editor':
        return '✏️';
      case 'contributor':
        return '✍️';
      default:
        return '👤';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-100 transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-sage/10 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-sage" />
          )}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-neutral-900">{user.name}</div>
          <div className="text-xs text-neutral-500 capitalize">{user.role}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-2">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-neutral-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-sage/10 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-sage" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900">{user.name}</div>
                  <div className="text-sm text-neutral-500">{user.email}</div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium mt-1 ${getRoleColor(user.role)}`}>
                    <span>{getRoleIcon(user.role)}</span>
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button className="w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-3">
                <Settings className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-700">Profile Settings</span>
              </button>

              <button className="w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-3">
                <Shield className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-700">Permissions</span>
              </button>
            </div>

            <div className="border-t border-neutral-100 pt-2">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
