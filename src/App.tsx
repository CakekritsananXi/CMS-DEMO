import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { CollaborationProvider } from './contexts/CollaborationContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Ideation from './pages/Ideation';
import Strategy from './pages/Strategy';
import Library from './pages/Library';
import Analytics from './pages/Analytics';
import Collaboration from './pages/Collaboration';
import Security from './pages/Security';
import ErrorBoundary from './components/ErrorBoundary';
import { useAnalytics, useMobileAnalytics } from './hooks/useAnalytics';
import { getDeviceCapabilities, optimizeForMobile } from './utils/mobile';

function App() {
  const [deviceCapabilities, setDeviceCapabilities] = useState(getDeviceCapabilities());
  
  // Initialize analytics with Supabase configuration (if available)
  const analytics = useAnalytics({
    trackPageViews: true,
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackInteractions: true,
    trackPerformance: true,
    // Note: In a real app, these would come from environment variables
    // supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
    // supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  });

  const mobileAnalytics = useMobileAnalytics();

  useEffect(() => {
    // Apply mobile optimizations
    if (deviceCapabilities.isMobile) {
      optimizeForMobile();
    }

    // Track app initialization
    analytics.trackEvent('app_initialized', 'page_view', {
      device_capabilities: deviceCapabilities,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      pixel_ratio: window.devicePixelRatio,
      color_depth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookie_enabled: navigator.cookieEnabled,
      online: navigator.onLine
    });

    // Track device capabilities for optimization insights
    analytics.trackEvent('device_capabilities_detected', 'performance', {
      device_type: deviceCapabilities.device_type,
      is_mobile: deviceCapabilities.isMobile,
      is_tablet: deviceCapabilities.isTablet,
      is_desktop: deviceCapabilities.isDesktop,
      is_touch_device: deviceCapabilities.isTouchDevice,
      has_hover: deviceCapabilities.hasHover,
      pixel_ratio: deviceCapabilities.pixelRatio,
      connection_speed: deviceCapabilities.connectionSpeed,
      screen_orientation: deviceCapabilities.screenSize.orientation,
      capabilities: deviceCapabilities.capabilities
    });
  }, [analytics, deviceCapabilities]);

  // Handle device capability changes (orientation, resize, etc.)
  useEffect(() => {
    const handleCapabilityChange = () => {
      const newCapabilities = getDeviceCapabilities();
      
      // Check if orientation changed
      if (newCapabilities.screenSize.orientation !== deviceCapabilities.screenSize.orientation) {
        mobileAnalytics.trackOrientationChange(newCapabilities.screenSize.orientation);
      }
      
      // Check if device type changed (e.g., browser resize)
      if (newCapabilities.device_type !== deviceCapabilities.device_type) {
        analytics.trackEvent('device_type_changed', 'user_action', {
          from_device_type: deviceCapabilities.device_type,
          to_device_type: newCapabilities.device_type,
          new_viewport: `${newCapabilities.viewport.width}x${newCapabilities.viewport.height}`
        });
      }
      
      setDeviceCapabilities(newCapabilities);
    };

    // Debounce capability changes to avoid excessive tracking
    let timeoutId: NodeJS.Timeout;
    const debouncedHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleCapabilityChange, 300);
    };

    window.addEventListener('resize', debouncedHandler);
    window.addEventListener('orientationchange', debouncedHandler);

    return () => {
      window.removeEventListener('resize', debouncedHandler);
      window.removeEventListener('orientationchange', debouncedHandler);
      clearTimeout(timeoutId);
    };
  }, [analytics, mobileAnalytics, deviceCapabilities]);

  // Track network connectivity changes
  useEffect(() => {
    const handleOnline = () => mobileAnalytics.trackOfflineUsage(true);
    const handleOffline = () => mobileAnalytics.trackOfflineUsage(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [mobileAnalytics]);

  // Track visibility changes for engagement metrics
  useEffect(() => {
    const handleVisibilityChange = () => {
      analytics.trackEvent('page_visibility_changed', 'engagement', {
        is_visible: !document.hidden,
        device_type: deviceCapabilities.device_type
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [analytics, deviceCapabilities]);

  // Track PWA install prompts (mobile-specific)
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      mobileAnalytics.trackAppInstall();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [mobileAnalytics]);

  // Global error tracking
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      analytics.trackEvent('global_error', 'error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        device_type: deviceCapabilities.device_type,
        user_agent: navigator.userAgent
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackEvent('unhandled_promise_rejection', 'error', {
        reason: event.reason,
        device_type: deviceCapabilities.device_type
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [analytics, deviceCapabilities]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <DatabaseProvider>
          <CollaborationProvider>
            <Router>
              <div className={`min-h-screen bg-cream ${deviceCapabilities.isMobile ? 'mobile-app' : ''}`}>
                <Navigation />
                <main className="relative">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/ideation" element={<Ideation />} />
                    <Route path="/strategy" element={<Strategy />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/collaboration" element={<Collaboration />} />
                    <Route path="/security" element={<Security />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </CollaborationProvider>
        </DatabaseProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
