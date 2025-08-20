import React, { useState } from 'react';
import { Key, AlertCircle, CheckCircle, ExternalLink, Info } from 'lucide-react';
import { lighthouseService } from '../../services/lighthouse';

const LighthouseConfiguration: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }

    try {
      lighthouseService.setApiKey(apiKey.trim());
      setIsConfigured(true);
      alert('Google API key configured successfully! You now have higher rate limits.');
      setApiKey(''); // Clear the input for security
    } catch (error) {
      alert('Failed to configure API key');
    }
  };

  const handleClearApiKey = () => {
    lighthouseService.setApiKey('');
    setIsConfigured(false);
    alert('API key cleared. Using default rate limits.');
  };

  return (
    <div className="mobile-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <Key className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-responsive-lg font-semibold text-neutral-900">
            Lighthouse API Configuration
          </h3>
          <p className="text-responsive-sm text-neutral-600">
            Configure Google API key for higher rate limits
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className="mb-6 p-3 bg-neutral-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-700">API Key Status</span>
          <div className="flex items-center space-x-2">
            {isConfigured ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">Configured</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">Using Default Limits</span>
              </>
            )}
          </div>
        </div>
        
        {!isConfigured && (
          <div className="mt-2 text-xs text-neutral-600">
            Default: ~10 requests per minute. Add API key for up to 25,000 requests per day.
          </div>
        )}
      </div>

      {/* Rate Limit Information */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Rate Limit Information</p>
            <ul className="text-xs space-y-1">
              <li>• Without API key: Limited to ~10 requests per minute</li>
              <li>• With API key: Up to 25,000 requests per day</li>
              <li>• Tests are automatically spaced out to avoid rate limits</li>
              <li>• Failed requests will retry with exponential backoff</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Key Configuration */}
      {!isConfigured && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Google PageSpeed Insights API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSyBdVl-cTICSwYKrZ95SuvNw7dbMuDt1KG0"
              className="mobile-input"
            />
            <p className="text-xs text-neutral-600 mt-1">
              Get your free API key from the Google Cloud Console
            </p>
          </div>

          <button
            onClick={handleSetApiKey}
            disabled={!apiKey.trim()}
            className="w-full mobile-button-primary"
          >
            Configure API Key
          </button>
          
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full mobile-button-secondary text-sm"
          >
            {showInstructions ? 'Hide' : 'Show'} Setup Instructions
          </button>
        </div>
      )}

      {/* Clear API Key */}
      {isConfigured && (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 text-green-800 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium text-sm">API Key Active</span>
            </div>
            <p className="text-xs text-green-700">
              You now have access to higher rate limits for performance testing.
            </p>
          </div>
          
          <button
            onClick={handleClearApiKey}
            className="w-full mobile-button-secondary text-sm"
          >
            Remove API Key
          </button>
        </div>
      )}

      {/* Setup Instructions */}
      {showInstructions && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h4 className="font-medium text-neutral-900 mb-3 text-sm">
            How to get a Google PageSpeed Insights API Key:
          </h4>
          
          <ol className="text-xs text-neutral-700 space-y-2">
            <li className="flex">
              <span className="font-medium mr-2">1.</span>
              <span>Go to the Google Cloud Console</span>
            </li>
            <li className="flex">
              <span className="font-medium mr-2">2.</span>
              <span>Create a new project or select an existing one</span>
            </li>
            <li className="flex">
              <span className="font-medium mr-2">3.</span>
              <span>Enable the PageSpeed Insights API</span>
            </li>
            <li className="flex">
              <span className="font-medium mr-2">4.</span>
              <span>Go to Credentials and create an API key</span>
            </li>
            <li className="flex">
              <span className="font-medium mr-2">5.</span>
              <span>Restrict the key to PageSpeed Insights API (recommended)</span>
            </li>
            <li className="flex">
              <span className="font-medium mr-2">6.</span>
              <span>Copy and paste the API key above</span>
            </li>
          </ol>
          
          <div className="mt-4 pt-3 border-t border-neutral-200">
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs"
            >
              <span>Open Google Cloud Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LighthouseConfiguration;
