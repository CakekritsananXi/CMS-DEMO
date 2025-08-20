import React, { useState, useEffect } from 'react';
import { Database, AlertCircle, CheckCircle, Settings, ExternalLink } from 'lucide-react';
import { trackingService } from '../../services/tracking';

const TrackingConfiguration: React.FC = () => {
  const [configStatus, setConfigStatus] = useState(trackingService.getConfigurationStatus());
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    // Update status every few seconds
    const interval = setInterval(() => {
      setConfigStatus(trackingService.getConfigurationStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleConfigure = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      alert('Please provide both Supabase URL and API key');
      return;
    }

    setIsConfiguring(true);
    try {
      await trackingService.initialize(supabaseUrl.trim(), supabaseKey.trim());
      
      // Try to sync pending events
      await trackingService.syncPendingEvents();
      
      setConfigStatus(trackingService.getConfigurationStatus());
      alert('Supabase analytics configured successfully!');
      
      // Clear form
      setSupabaseUrl('');
      setSupabaseKey('');
    } catch (error) {
      console.error('Failed to configure Supabase:', error);
      alert('Failed to configure Supabase. Please check your credentials.');
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleClearPending = () => {
    if (confirm('Are you sure you want to clear all pending analytics events?')) {
      trackingService.clearPendingEvents();
      setConfigStatus(trackingService.getConfigurationStatus());
    }
  };

  return (
    <div className="mobile-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Database className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-responsive-lg font-semibold text-neutral-900">Analytics Configuration</h3>
          <p className="text-responsive-sm text-neutral-600">Configure Supabase for analytics tracking</p>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <span className="text-sm text-neutral-700">Service Initialized</span>
          <div className="flex items-center space-x-2">
            {configStatus.isInitialized ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {configStatus.isInitialized ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <span className="text-sm text-neutral-700">Supabase Configuration</span>
          <div className="flex items-center space-x-2">
            {configStatus.isFullyConfigured ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm font-medium">
              {configStatus.isFullyConfigured ? 'Configured' : 'Not Configured'}
            </span>
          </div>
        </div>

        {configStatus.pendingEventsCount > 0 && (
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-sm text-yellow-800">Pending Events</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-yellow-800">
                {configStatus.pendingEventsCount} events
              </span>
              <button
                onClick={handleClearPending}
                className="text-xs text-yellow-700 hover:text-yellow-800 underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {!configStatus.isFullyConfigured && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Supabase Project URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="mobile-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Supabase Anon Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="mobile-input"
            />
          </div>

          <button
            onClick={handleConfigure}
            disabled={isConfiguring || !supabaseUrl.trim() || !supabaseKey.trim()}
            className="w-full mobile-button-primary flex items-center justify-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>{isConfiguring ? 'Configuring...' : 'Configure Analytics'}</span>
          </button>
        </div>
      )}

      {configStatus.isFullyConfigured && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 text-green-800 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Analytics Active</span>
          </div>
          <p className="text-sm text-green-700">
            Analytics data is being tracked and sent to your Supabase database.
            {configStatus.pendingEventsCount > 0 && ` ${configStatus.pendingEventsCount} pending events will be synced.`}
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Need help setting up Supabase?</span>
          <a 
            href="https://supabase.com/docs/guides/getting-started" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <span>View Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrackingConfiguration;
