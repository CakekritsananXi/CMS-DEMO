export interface AnalyticsEvent {
  id?: string;
  event_name: string;
  event_type: 'page_view' | 'user_action' | 'performance' | 'error' | 'engagement';
  properties: Record<string, any>;
  user_id?: string;
  session_id: string;
  device_info: DeviceInfo;
  timestamp: string;
  url: string;
  referrer?: string;
}

export interface DeviceInfo {
  device_type: 'mobile' | 'tablet' | 'desktop';
  screen_width: number;
  screen_height: number;
  viewport_width: number;
  viewport_height: number;
  user_agent: string;
  os: string;
  browser: string;
  is_touch_device: boolean;
  pixel_ratio: number;
  connection_type?: string;
}

export interface PerformanceMetrics {
  id?: string;
  session_id: string;
  page_url: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  navigation_timing: {
    dns_lookup: number;
    tcp_connection: number;
    ssl_handshake: number;
    ttfb: number;
    dom_content_loaded: number;
    load_complete: number;
  };
  core_web_vitals: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };
  resource_timing: {
    total_resources: number;
    total_size: number;
    render_blocking_resources: number;
  };
  memory_usage?: {
    used_js_heap_size: number;
    total_js_heap_size: number;
    js_heap_size_limit: number;
  };
  timestamp: string;
}

export interface UserSession {
  session_id: string;
  user_id?: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  page_views: number;
  device_info: DeviceInfo;
  is_mobile: boolean;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

class TrackingService {
  private sessionId: string;
  private userId?: string;
  private deviceInfo: DeviceInfo;
  private sessionStartTime: number;
  private pageViews: number = 0;
  private supabaseUrl?: string;
  private supabaseKey?: string;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.deviceInfo = this.getDeviceInfo();
  }

  async initialize(supabaseUrl?: string, supabaseKey?: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.isInitialized = true;

    // Start session tracking
    await this.startSession();

    // Set up page visibility and unload listeners
    this.setupEventListeners();

    // Start performance monitoring
    this.startPerformanceMonitoring();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    const screen = window.screen;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    return {
      device_type: this.getDeviceType(),
      screen_width: screen.width,
      screen_height: screen.height,
      viewport_width: viewport.width,
      viewport_height: viewport.height,
      user_agent: ua,
      os: this.getOS(ua),
      browser: this.getBrowser(ua),
      is_touch_device: 'ontouchstart' in window,
      pixel_ratio: window.devicePixelRatio || 1,
      connection_type: this.getConnectionType()
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getOS(ua: string): string {
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Macintosh/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Unknown';
  }

  private getBrowser(ua: string): string {
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) return 'Chrome';
    if (/Firefox/i.test(ua)) return 'Firefox';
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
    if (/Edge/i.test(ua)) return 'Edge';
    return 'Unknown';
  }

  private getConnectionType(): string | undefined {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection ? connection.effectiveType : undefined;
  }

  async trackEvent(eventName: string, eventType: AnalyticsEvent['event_type'], properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      event_name: eventName,
      event_type: eventType,
      properties: {
        ...properties,
        device_type: this.deviceInfo.device_type,
        is_mobile: this.deviceInfo.device_type === 'mobile',
        viewport_size: `${this.deviceInfo.viewport_width}x${this.deviceInfo.viewport_height}`,
        connection_type: this.deviceInfo.connection_type
      },
      user_id: this.userId,
      session_id: this.sessionId,
      device_info: this.deviceInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer
    };

    try {
      if (this.isInitialized && this.supabaseUrl && this.supabaseKey) {
        await this.sendToSupabase('analytics_events', event);
      } else {
        // Store locally when Supabase is not configured
        this.storeEventLocally(event);
      }
    } catch (error) {
      console.warn('Failed to track event:', error);
      // Store in localStorage as fallback
      this.storeEventLocally(event);
    }
  }

  async trackPageView(page?: string) {
    this.pageViews++;
    await this.trackEvent('page_view', 'page_view', {
      page: page || window.location.pathname,
      title: document.title,
      page_number: this.pageViews
    });
  }

  async trackPerformance() {
    if (!window.performance || !window.performance.timing) {
      return;
    }

    const timing = window.performance.timing;
    const navigation = timing.navigationStart;

    const metrics: PerformanceMetrics = {
      session_id: this.sessionId,
      page_url: window.location.href,
      device_type: this.deviceInfo.device_type,
      navigation_timing: {
        dns_lookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcp_connection: timing.connectEnd - timing.connectStart,
        ssl_handshake: timing.secureConnectionStart ? timing.connectEnd - timing.secureConnectionStart : 0,
        ttfb: timing.responseStart - navigation,
        dom_content_loaded: timing.domContentLoadedEventEnd - navigation,
        load_complete: timing.loadEventEnd - navigation
      },
      core_web_vitals: await this.getCoreWebVitals(),
      resource_timing: this.getResourceTiming(),
      memory_usage: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    };

    try {
      if (this.isInitialized && this.supabaseUrl && this.supabaseKey) {
        await this.sendToSupabase('performance_metrics', metrics);
      } else {
        // Log performance metrics locally when Supabase is not configured
        console.log('Performance metrics (local):', metrics);
      }
    } catch (error) {
      console.warn('Failed to track performance:', error);
    }
  }

  private async getCoreWebVitals() {
    return new Promise<PerformanceMetrics['core_web_vitals']>((resolve) => {
      const vitals = {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: window.performance.timing.responseStart - window.performance.timing.navigationStart
      };

      // Use Web Vitals library if available, otherwise use approximate values
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.lcp = lastEntry.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          // First Contentful Paint
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) vitals.fcp = fcpEntry.startTime;
          }).observe({ type: 'paint', buffered: true });

          // Cumulative Layout Shift
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            vitals.cls = clsValue;
          }).observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => resolve(vitals), 100);
        } catch (error) {
          resolve(vitals);
        }
      } else {
        resolve(vitals);
      }
    });
  }

  private getResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((sum, resource: any) => {
      return sum + (resource.encodedBodySize || 0);
    }, 0);

    const renderBlockingResources = resources.filter((resource: any) => {
      return resource.renderBlockingStatus === 'blocking';
    });

    return {
      total_resources: resources.length,
      total_size: totalSize,
      render_blocking_resources: renderBlockingResources.length
    };
  }

  private getMemoryUsage() {
    const memory = (performance as any).memory;
    if (!memory) return undefined;

    return {
      used_js_heap_size: memory.usedJSHeapSize,
      total_js_heap_size: memory.totalJSHeapSize,
      js_heap_size_limit: memory.jsHeapSizeLimit
    };
  }

  private async startSession() {
    const session: UserSession = {
      session_id: this.sessionId,
      user_id: this.userId,
      start_time: new Date().toISOString(),
      page_views: 0,
      device_info: this.deviceInfo,
      is_mobile: this.deviceInfo.device_type === 'mobile',
      referrer: document.referrer,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined
    };

    try {
      if (this.isInitialized && this.supabaseUrl && this.supabaseKey) {
        await this.sendToSupabase('user_sessions', session);
      } else {
        // Log session locally when Supabase is not configured
        console.log('Session started (local):', session);
      }
    } catch (error) {
      console.warn('Failed to start session:', error);
    }
  }

  private async endSession() {
    const duration = Date.now() - this.sessionStartTime;
    
    try {
      if (this.isInitialized && this.supabaseUrl && this.supabaseKey) {
        await this.sendToSupabase('user_sessions', {
          session_id: this.sessionId,
          end_time: new Date().toISOString(),
          duration: Math.round(duration / 1000),
          page_views: this.pageViews
        }, 'session_id');
      } else {
        // Log session end locally when Supabase is not configured
        console.log('Session ended (local):', {
          session_id: this.sessionId,
          duration: Math.round(duration / 1000),
          page_views: this.pageViews
        });
      }
    } catch (error) {
      console.warn('Failed to end session:', error);
    }
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackEvent('page_hidden', 'engagement');
      } else {
        this.trackEvent('page_visible', 'engagement');
      }
    });

    // Track session end
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Track orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.deviceInfo = this.getDeviceInfo();
        this.trackEvent('orientation_change', 'user_action', {
          orientation: window.orientation,
          new_viewport: `${window.innerWidth}x${window.innerHeight}`
        });
      }, 100);
    });
  }

  private startPerformanceMonitoring() {
    // Track performance after page load
    if (document.readyState === 'complete') {
      setTimeout(() => this.trackPerformance(), 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.trackPerformance(), 1000);
      });
    }
  }

  private async sendToSupabase(table: string, data: any, updateColumn?: string) {
    if (!this.isInitialized) {
      throw new Error('Tracking service not initialized');
    }

    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase configuration missing (URL or key not provided)');
    }

    const method = updateColumn ? 'PATCH' : 'POST';
    const url = updateColumn 
      ? `${this.supabaseUrl}/rest/v1/${table}?${updateColumn}=eq.${data[updateColumn]}`
      : `${this.supabaseUrl}/rest/v1/${table}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Supabase request failed: ${response.status}`);
    }
  }

  private storeEventLocally(event: AnalyticsEvent) {
    try {
      const events = JSON.parse(localStorage.getItem('pending_analytics') || '[]');
      events.push(event);
      localStorage.setItem('pending_analytics', JSON.stringify(events.slice(-100))); // Keep only last 100 events
    } catch (error) {
      console.error('Failed to store event locally:', error);
    }
  }

  async syncPendingEvents() {
    try {
      const events = JSON.parse(localStorage.getItem('pending_analytics') || '[]');
      if (events.length === 0) return;

      if (!this.isInitialized || !this.supabaseUrl || !this.supabaseKey) {
        console.log('Supabase not configured, keeping events in local storage');
        return;
      }

      for (const event of events) {
        await this.sendToSupabase('analytics_events', event);
      }

      localStorage.removeItem('pending_analytics');
    } catch (error) {
      console.warn('Failed to sync pending events:', error);
    }
  }
}

export const trackingService = new TrackingService();
