export interface TouchGestureOptions {
  threshold?: number;
  velocity?: number;
  preventScroll?: boolean;
  onSwipeStart?: (event: TouchEvent) => void;
  onSwipeMove?: (event: TouchEvent, direction: SwipeDirection, distance: number) => void;
  onSwipeEnd?: (event: TouchEvent, direction: SwipeDirection, distance: number) => void;
}

export type SwipeDirection = 'up' | 'down' | 'left' | 'right' | null;

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  hasHover: boolean;
  pixelRatio: number;
  connectionSpeed: 'slow' | 'medium' | 'fast' | 'unknown';
  screenSize: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
  };
  viewport: {
    width: number;
    height: number;
    scale: number;
  };
  capabilities: {
    webGL: boolean;
    webWorkers: boolean;
    serviceWorkers: boolean;
    localStorage: boolean;
    indexedDB: boolean;
    webRTC: boolean;
  };
}

// Device detection utilities
export function getDeviceCapabilities(): DeviceCapabilities {
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  const isMobile = width < 768 || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Detect hover capability
  const hasHover = window.matchMedia('(hover: hover)').matches;
  
  // Get pixel ratio
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Estimate connection speed
  const connectionSpeed = getConnectionSpeed();
  
  // Screen orientation
  const orientation = height > width ? 'portrait' : 'landscape';
  
  // Viewport scale
  const visualViewport = (window as any).visualViewport;
  const scale = visualViewport ? visualViewport.scale : 1;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    hasHover,
    pixelRatio,
    connectionSpeed,
    screenSize: {
      width: screen.width,
      height: screen.height,
      orientation
    },
    viewport: {
      width,
      height,
      scale
    },
    capabilities: {
      webGL: !!window.WebGLRenderingContext,
      webWorkers: typeof Worker !== 'undefined',
      serviceWorkers: 'serviceWorker' in navigator,
      localStorage: typeof Storage !== 'undefined',
      indexedDB: 'indexedDB' in window,
      webRTC: !!(navigator as any).getUserMedia || !!(navigator as any).webkitGetUserMedia || !!(navigator as any).mozGetUserMedia
    }
  };
}

// Connection speed estimation
function getConnectionSpeed(): 'slow' | 'medium' | 'fast' | 'unknown' {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return 'unknown';
  
  const effectiveType = connection.effectiveType;
  const downlink = connection.downlink;
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
    return 'slow';
  } else if (effectiveType === '3g' || downlink < 5) {
    return 'medium';
  } else {
    return 'fast';
  }
}

// Touch gesture detection
export function createSwipeDetector(element: HTMLElement, options: TouchGestureOptions = {}) {
  const {
    threshold = 50,
    velocity = 0.3,
    preventScroll = false,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd
  } = options;

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isTracking = false;

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    isTracking = true;
    
    onSwipeStart?.(event);
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!isTracking || event.touches.length !== 1) return;
    
    if (preventScroll) {
      event.preventDefault();
    }
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const direction = getSwipeDirection(deltaX, deltaY, threshold);
    
    onSwipeMove?.(event, direction, distance);
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (!isTracking) return;
    
    const endTime = Date.now();
    const deltaTime = endTime - startTime;
    
    if (event.changedTouches.length === 1) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const swipeVelocity = distance / deltaTime;
      
      const direction = getSwipeDirection(deltaX, deltaY, threshold);
      
      if (direction && swipeVelocity >= velocity) {
        onSwipeEnd?.(event, direction, distance);
      }
    }
    
    isTracking = false;
  };

  // Add event listeners
  element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
  element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

function getSwipeDirection(deltaX: number, deltaY: number, threshold: number): SwipeDirection {
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);
  
  if (Math.max(absDeltaX, absDeltaY) < threshold) {
    return null;
  }
  
  if (absDeltaX > absDeltaY) {
    return deltaX > 0 ? 'right' : 'left';
  } else {
    return deltaY > 0 ? 'down' : 'up';
  }
}

// Viewport utilities
export function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight
  };
}

export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
  };
}

// Performance optimization for mobile
export function optimizeForMobile() {
  // Disable text selection for better touch UX
  document.body.style.webkitUserSelect = 'none';
  document.body.style.userSelect = 'none';
  
  // Improve touch responsiveness
  document.body.style.webkitTapHighlightColor = 'transparent';
  document.body.style.webkitTouchCallout = 'none';
  
  // Optimize scrolling
  document.body.style.webkitOverflowScrolling = 'touch';
  document.body.style.overscrollBehavior = 'none';
  
  // Prevent zoom on input focus (iOS)
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    const currentContent = viewport.getAttribute('content') || '';
    if (!currentContent.includes('maximum-scale')) {
      viewport.setAttribute('content', `${currentContent}, maximum-scale=1.0, user-scalable=no`);
    }
  }
}

// Touch-friendly button utilities
export function createTouchFriendlyButton(options: {
  minSize?: number;
  rippleEffect?: boolean;
  hapticFeedback?: boolean;
} = {}) {
  const { minSize = 44, rippleEffect = true, hapticFeedback = false } = options;
  
  return {
    style: {
      minHeight: `${minSize}px`,
      minWidth: `${minSize}px`,
      padding: '12px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      touchAction: 'manipulation',
      userSelect: 'none',
      outline: 'none',
      transition: 'all 0.2s ease'
    },
    
    onTouchStart: (event: TouchEvent) => {
      const button = event.currentTarget as HTMLElement;
      
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
      
      if (rippleEffect) {
        createRippleEffect(button, event);
      }
      
      button.style.transform = 'scale(0.98)';
    },
    
    onTouchEnd: (event: TouchEvent) => {
      const button = event.currentTarget as HTMLElement;
      button.style.transform = 'scale(1)';
    }
  };
}

function createRippleEffect(element: HTMLElement, event: TouchEvent) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const touch = event.touches[0];
  
  const size = Math.max(rect.width, rect.height);
  const x = touch.clientX - rect.left - size / 2;
  const y = touch.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    animation: ripple 0.6s ease-out;
  `;
  
  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  
  if (!document.head.querySelector('[data-ripple-style]')) {
    style.setAttribute('data-ripple-style', 'true');
    document.head.appendChild(style);
  }
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Intersection Observer for mobile performance
export function createIntersectionObserver(callback: IntersectionObserverCallback, options: {
  threshold?: number | number[];
  rootMargin?: string;
  lazy?: boolean;
} = {}) {
  const { threshold = 0.1, rootMargin = '50px', lazy = true } = options;
  
  if (!lazy || !('IntersectionObserver' in window)) {
    // Fallback for older browsers or when lazy loading is disabled
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    };
  }
  
  return new IntersectionObserver(callback, {
    threshold,
    rootMargin
  });
}

// Debounced resize observer for mobile
export function createResizeObserver(callback: (entries: ResizeObserverEntry[]) => void, debounceMs = 100) {
  if (!('ResizeObserver' in window)) {
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    };
  }
  
  let timeoutId: NodeJS.Timeout;
  
  return new ResizeObserver((entries) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(entries), debounceMs);
  });
}
