import React, { useState, useEffect } from 'react';
import { Database, X, Settings } from 'lucide-react';
import { trackingService } from '../../services/tracking';

interface AnalyticsStatusNoticeProps {
  onOpenConfig?: () => void;
}

const AnalyticsStatusNotice: React.FC<AnalyticsStatusNoticeProps> = ({ onOpenConfig }) => {
  const [configStatus, setConfigStatus] = useState(trackingService.getConfigurationStatus());
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed this notice
    const dismissed = localStorage.getItem('analytics_notice_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Update status periodically
    const interval = setInterval(() => {
      setConfigStatus(trackingService.getConfigurationStatus());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('analytics_notice_dismissed', 'true');
  };

  // Don't show if dismissed or fully configured
  if (isDismissed || configStatus.isFullyConfigured) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-40">
      <div className="bg-white rounded-xl border border-blue-200 shadow-medium p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-neutral-900 mb-1">
              Analytics Tracking
            </h4>
            <p className="text-xs text-neutral-600 mb-3">
              Analytics are being stored locally. Configure Supabase to enable cloud tracking.
            </p>
            
            {configStatus.pendingEventsCount > 0 && (
              <p className="text-xs text-blue-600 mb-3">
                {configStatus.pendingEventsCount} events pending sync
              </p>
            )}
            
            <div className="flex space-x-2">
              {onOpenConfig && (
                <button
                  onClick={onOpenConfig}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>Configure</span>
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="text-xs text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsStatusNotice;
