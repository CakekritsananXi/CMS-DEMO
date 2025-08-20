import React from 'react';
import { Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

interface ConnectionStatusProps {
  isConnected: boolean;
  isReconnecting?: boolean;
  reconnectAttempts?: number;
  onRetry?: () => void;
}

interface SkeletonProps {
  lines?: number;
  className?: string;
  showAvatar?: boolean;
  showButton?: boolean;
}

// Main Loading Component
export const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  const renderSpinner = () => (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className={`${sizeClasses[size]} text-sage animate-spin`} />
        {text && (
          <p className="text-sm text-neutral-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  );

  const renderDots = () => (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-sage rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        {text && (
          <p className="text-sm text-neutral-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  );

  const renderPulse = () => (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className={`${sizeClasses[size]} bg-sage rounded-full animate-pulse`} />
        {text && (
          <p className="text-sm text-neutral-600 font-medium animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );

  switch (type) {
    case 'dots':
      return renderDots();
    case 'pulse':
      return renderPulse();
    case 'skeleton':
      return <Skeleton className={className} />;
    default:
      return renderSpinner();
  }
};

// Skeleton Loading Component
export const Skeleton: React.FC<SkeletonProps> = ({
  lines = 3,
  className = '',
  showAvatar = false,
  showButton = false
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-neutral-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2" />
            <div className="h-3 bg-neutral-200 rounded w-1/3" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-neutral-200 rounded ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>

      {showButton && (
        <div className="mt-4">
          <div className="h-10 bg-neutral-200 rounded-xl w-32" />
        </div>
      )}
    </div>
  );
};

// Connection Status Component
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isReconnecting = false,
  reconnectAttempts = 0,
  onRetry
}) => {
  if (isConnected && !isReconnecting) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-3 rounded-xl shadow-medium border flex items-center space-x-3 ${
        isReconnecting 
          ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        {isReconnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">
              Reconnecting... (attempt {reconnectAttempts})
            </span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Connection lost</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="ml-2 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded-lg transition-colors duration-200"
              >
                Retry
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Loading Overlay for specific components
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
}> = ({ isLoading, children, text }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <Loading text={text} type="spinner" />
        </div>
      )}
    </div>
  );
};

// Card Skeleton for lists
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-neutral-200 p-6">
          <Skeleton showAvatar lines={2} showButton />
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-neutral-50 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-neutral-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-neutral-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className={`h-4 bg-neutral-200 rounded animate-pulse ${
                    colIndex === 0 ? 'w-3/4' : 'w-full'
                  }`} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Error State Component
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}> = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  onRetry,
  retryText = "Try again"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default Loading;
