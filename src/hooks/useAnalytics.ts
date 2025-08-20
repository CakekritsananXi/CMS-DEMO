import React, { useEffect, useCallback, useRef } from 'react';
import { trackingService, AnalyticsEvent } from '../services/tracking';
import { getDeviceCapabilities } from '../utils/mobile';

interface UseAnalyticsOptions {
  trackPageViews?: boolean;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  trackInteractions?: boolean;
  trackPerformance?: boolean;
  supabaseUrl?: string;
  supabaseKey?: string;
}

interface AnalyticsHook {
  trackEvent: (eventName: string, eventType: AnalyticsEvent['event_type'], properties?: Record<string, any>) => Promise<void>;
  trackPageView: (page?: string) => Promise<void>;
  trackClick: (element: string, context?: Record<string, any>) => Promise<void>;
  trackFormSubmit: (formName: string, fields: string[]) => Promise<void>;
  trackError: (error: Error, context?: Record<string, any>) => Promise<void>;
  trackPerformance: () => Promise<void>;
  setUserId: (userId: string) => void;
}

export function useAnalytics(options: UseAnalyticsOptions = {}): AnalyticsHook {
  const {
    trackPageViews = true,
    trackScrollDepth = true,
    trackTimeOnPage = true,
    trackInteractions = true,
    trackPerformance = true,
    supabaseUrl,
    supabaseKey
  } = options;

  const pageStartTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const deviceCapabilities = useRef(getDeviceCapabilities());
  const isInitialized = useRef<boolean>(false);

  // Initialize tracking service
  useEffect(() => {
    if (!isInitialized.current) {
      trackingService.initialize(supabaseUrl, supabaseKey);
      isInitialized.current = true;
    }
  }, [supabaseUrl, supabaseKey]);

  // Track page views
  useEffect(() => {
    if (trackPageViews) {
      pageStartTime.current = Date.now();
      trackingService.trackPageView();
    }
  }, [trackPageViews]);

  // Track time on page when component unmounts or page changes
  useEffect(() => {
    return () => {
      if (trackTimeOnPage) {
        const timeOnPage = Date.now() - pageStartTime.current;
        trackingService.trackEvent('time_on_page', 'engagement', {
          duration_ms: timeOnPage,
          duration_seconds: Math.round(timeOnPage / 1000),
          page: window.location.pathname
        });
      }
    };
  }, [trackTimeOnPage]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight;
      const scrollDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);

      if (scrollDepth > maxScrollDepth.current) {
        maxScrollDepth.current = scrollDepth;

        // Track significant scroll milestones
        if (scrollDepth >= 25 && scrollDepth % 25 === 0) {
          trackingService.trackEvent('scroll_depth', 'engagement', {
            depth_percentage: scrollDepth,
            page: window.location.pathname,
            device_type: deviceCapabilities.current.device_type
          });
        }
      }
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [trackScrollDepth]);

  // Track interactions
  useEffect(() => {
    if (!trackInteractions) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      const text = target.textContent?.slice(0, 50) || '';

      // Only track meaningful interactions
      if (['button', 'a', 'input'].includes(tagName) || target.role === 'button') {
        trackingService.trackEvent('element_click', 'user_action', {
          element_type: tagName,
          element_class: className,
          element_id: id,
          element_text: text,
          page: window.location.pathname,
          device_type: deviceCapabilities.current.device_type,
          is_touch_device: deviceCapabilities.current.isTouchDevice,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`
        });
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [trackInteractions]);

  // Track performance
  useEffect(() => {
    if (!trackPerformance) return;

    const trackPagePerformance = () => {
      trackingService.trackPerformance();
    };

    if (document.readyState === 'complete') {
      setTimeout(trackPagePerformance, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackPagePerformance, 1000);
      });
    }
  }, [trackPerformance]);

  // Analytics functions
  const trackEvent = useCallback(async (
    eventName: string, 
    eventType: AnalyticsEvent['event_type'], 
    properties: Record<string, any> = {}
  ) => {
    await trackingService.trackEvent(eventName, eventType, {
      ...properties,
      device_capabilities: deviceCapabilities.current
    });
  }, []);

  const trackPageView = useCallback(async (page?: string) => {
    pageStartTime.current = Date.now();
    maxScrollDepth.current = 0;
    await trackingService.trackPageView(page);
  }, []);

  const trackClick = useCallback(async (element: string, context: Record<string, any> = {}) => {
    await trackEvent('manual_click_track', 'user_action', {
      element,
      ...context,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback(async (formName: string, fields: string[]) => {
    await trackEvent('form_submit', 'user_action', {
      form_name: formName,
      field_count: fields.length,
      fields: fields,
      device_type: deviceCapabilities.current.device_type
    });
  }, [trackEvent]);

  const trackError = useCallback(async (error: Error, context: Record<string, any> = {}) => {
    await trackEvent('client_error', 'error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      url: window.location.href,
      user_agent: navigator.userAgent,
      ...context
    });
  }, [trackEvent]);

  const trackPerformanceMetrics = useCallback(async () => {
    await trackingService.trackPerformance();
  }, []);

  const setUserId = useCallback((userId: string) => {
    trackingService.setUserId(userId);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackFormSubmit,
    trackError,
    trackPerformance: trackPerformanceMetrics,
    setUserId
  };
}

// Hook for tracking form analytics
export function useFormAnalytics(formName: string) {
  const { trackFormSubmit, trackEvent } = useAnalytics();

  const trackFormStart = useCallback(() => {
    trackEvent('form_start', 'user_action', {
      form_name: formName
    });
  }, [trackEvent, formName]);

  const trackFieldFocus = useCallback((fieldName: string) => {
    trackEvent('form_field_focus', 'user_action', {
      form_name: formName,
      field_name: fieldName
    });
  }, [trackEvent, formName]);

  const trackFieldBlur = useCallback((fieldName: string, value: any) => {
    trackEvent('form_field_blur', 'user_action', {
      form_name: formName,
      field_name: fieldName,
      has_value: !!value,
      value_length: typeof value === 'string' ? value.length : 0
    });
  }, [trackEvent, formName]);

  const trackFormError = useCallback((fieldName: string, errorMessage: string) => {
    trackEvent('form_validation_error', 'error', {
      form_name: formName,
      field_name: fieldName,
      error_message: errorMessage
    });
  }, [trackEvent, formName]);

  const trackFormSuccess = useCallback((fields: string[]) => {
    trackFormSubmit(formName, fields);
  }, [trackFormSubmit, formName]);

  return {
    trackFormStart,
    trackFieldFocus,
    trackFieldBlur,
    trackFormError,
    trackFormSuccess
  };
}

// Hook for tracking mobile-specific interactions
export function useMobileAnalytics() {
  const { trackEvent } = useAnalytics();
  const deviceCapabilities = useRef(getDeviceCapabilities());

  const trackSwipe = useCallback((direction: 'up' | 'down' | 'left' | 'right', element?: string) => {
    trackEvent('swipe_gesture', 'user_action', {
      direction,
      element,
      device_type: deviceCapabilities.current.device_type,
      is_touch_device: deviceCapabilities.current.isTouchDevice
    });
  }, [trackEvent]);

  const trackPinch = useCallback((scale: number, element?: string) => {
    trackEvent('pinch_gesture', 'user_action', {
      scale,
      element,
      device_type: deviceCapabilities.current.device_type
    });
  }, [trackEvent]);

  const trackOrientationChange = useCallback((orientation: string) => {
    trackEvent('orientation_change', 'user_action', {
      orientation,
      new_viewport: `${window.innerWidth}x${window.innerHeight}`,
      device_type: deviceCapabilities.current.device_type
    });
  }, [trackEvent]);

  const trackAppInstall = useCallback(() => {
    trackEvent('pwa_install_prompt', 'engagement', {
      device_type: deviceCapabilities.current.device_type
    });
  }, [trackEvent]);

  const trackOfflineUsage = useCallback((isOnline: boolean) => {
    trackEvent('connectivity_change', 'engagement', {
      is_online: isOnline,
      device_type: deviceCapabilities.current.device_type,
      connection_type: deviceCapabilities.current.connectionSpeed
    });
  }, [trackEvent]);

  return {
    trackSwipe,
    trackPinch,
    trackOrientationChange,
    trackAppInstall,
    trackOfflineUsage
  };
}
