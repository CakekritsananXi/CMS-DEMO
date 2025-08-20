import React from 'react';
import { Database, Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useConnectionStatus } from '../../contexts/DatabaseContext';

const ConnectionStatus: React.FC = () => {
  const { isConnected, isLoading, error } = useConnectionStatus();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
        <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Connecting to database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-800">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Database Error: {error}</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Database Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Database Disconnected</span>
    </div>
  );
};

export default ConnectionStatus;
