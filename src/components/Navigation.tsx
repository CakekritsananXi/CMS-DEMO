import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Calendar,
  Lightbulb,
  Target,
  FolderOpen,
  BarChart3,
  Users,
  Home,
  PenTool,
  LogIn,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './auth/UserMenu';
import AuthModal from './auth/AuthModal';
import { getDeviceCapabilities } from '../utils/mobile';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState(getDeviceCapabilities());
  const { isAuthenticated } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/ideation', icon: Lightbulb, label: 'Ideation' },
    { path: '/strategy', icon: Target, label: 'Strategy' },
    { path: '/library', icon: FolderOpen, label: 'Library' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/collaboration', icon: Users, label: 'Team' },
    { path: '/security', icon: Shield, label: 'Security' },
  ];

  // Update device capabilities on resize/orientation change
  useEffect(() => {
    const updateCapabilities = () => {
      setDeviceCapabilities(getDeviceCapabilities());
    };

    window.addEventListener('resize', updateCapabilities);
    window.addEventListener('orientationchange', updateCapabilities);

    return () => {
      window.removeEventListener('resize', updateCapabilities);
      window.removeEventListener('orientationchange', updateCapabilities);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-sm border-b border-neutral-200/50 sticky top-0 z-40 pt-safe">
        <div className="mobile-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-sage rounded-xl flex items-center justify-center">
                <PenTool className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-neutral-800 hidden sm:inline">
                ContentFlow
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex space-x-1">
                {navItems.map(({ path, icon: Icon, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250 touch-target ${
                        isActive
                          ? 'bg-sage text-white shadow-sm'
                          : 'text-neutral-600 hover:text-sage hover:bg-sage/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden xl:inline">{label}</span>
                  </NavLink>
                ))}
              </div>

              {/* Desktop Auth Section */}
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mobile-button-primary flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Tablet Navigation */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              <div className="flex space-x-1">
                {navItems.slice(0, 6).map(({ path, icon: Icon, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    title={label}
                    className={({ isActive }) =>
                      `flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium transition-all duration-250 touch-target ${
                        isActive
                          ? 'bg-sage text-white shadow-sm'
                          : 'text-neutral-600 hover:text-sage hover:bg-sage/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                  </NavLink>
                ))}
              </div>
              
              {/* Tablet Auth */}
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mobile-button-primary"
                  title="Sign In"
                >
                  <LogIn className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="touch-target p-2 rounded-xl text-neutral-600 hover:text-sage hover:bg-sage/5 transition-all duration-250 webkit-tap-transparent"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            
            {/* Mobile Menu */}
            <div className="fixed inset-y-0 right-0 w-64 bg-white border-l border-neutral-200 z-50 md:hidden pt-safe pb-safe transform transition-transform duration-300">
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-sage rounded-lg flex items-center justify-center">
                      <PenTool className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-neutral-800">ContentFlow</span>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="touch-target p-1 rounded-lg text-neutral-500 hover:text-neutral-700 transition-colors webkit-tap-transparent"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto px-4 pt-4">
                  <div className="space-y-1">
                    {navItems.map(({ path, icon: Icon, label }) => (
                      <NavLink
                        key={path}
                        to={path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `mobile-nav-item ${
                            isActive
                              ? 'bg-sage text-white shadow-sm'
                              : 'text-neutral-600 hover:text-sage hover:bg-sage/5 active:bg-sage/10'
                          }`
                        }
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Auth Section */}
                <div className="border-t border-neutral-100 p-4">
                  {isAuthenticated ? (
                    <div onClick={closeMobileMenu}>
                      <UserMenu />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        closeMobileMenu();
                      }}
                      className="w-full mobile-button-primary flex items-center justify-center space-x-2"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navigation;
