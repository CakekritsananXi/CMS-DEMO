import React, { useEffect, useState } from 'react';
import { Play, Pause, StopCircle, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { ScanResult } from '../../services/security';

interface ScanProgressProps {
  scan: ScanResult;
  onStop?: (scanId: string) => void;
  onPause?: (scanId: string) => void;
  onResume?: (scanId: string) => void;
  className?: string;
}

const ScanProgress: React.FC<ScanProgressProps> = ({
  scan,
  onStop,
  onPause,
  onResume,
  className = ''
}) => {
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (scan.status === 'running' && scan.progress > 0 && scan.progress < 100) {
      const elapsed = Date.now() - new Date(scan.startTime).getTime();
      const rate = scan.progress / elapsed;
      const remaining = (100 - scan.progress) / rate;
      
      const remainingMinutes = Math.ceil(remaining / 60000);
      if (remainingMinutes < 60) {
        setEstimatedTimeRemaining(`${remainingMinutes}m remaining`);
      } else {
        const hours = Math.floor(remainingMinutes / 60);
        const minutes = remainingMinutes % 60;
        setEstimatedTimeRemaining(`${hours}h ${minutes}m remaining`);
      }
    } else {
      setEstimatedTimeRemaining('');
    }
  }, [scan.progress, scan.status, scan.startTime]);

  const getStatusIcon = () => {
    switch (scan.status) {
      case 'running':
        return <Zap className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-neutral-600" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getStatusColor = () => {
    switch (scan.status) {
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'queued':
        return 'text-neutral-600 bg-neutral-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = end.getTime() - start.getTime();
    
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getProgressBarColor = () => {
    if (scan.status === 'completed') return 'bg-green-500';
    if (scan.status === 'failed') return 'bg-red-500';
    if (scan.progress >= 80) return 'bg-blue-500';
    if (scan.progress >= 50) return 'bg-yellow-500';
    return 'bg-sage';
  };

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl shadow-soft p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium text-neutral-900">{scan.target}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor()}`}>
                {scan.status}
              </span>
              <span className="text-xs text-neutral-500">ID: {scan.id}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {scan.status === 'running' && (
            <>
              {onPause && (
                <button
                  onClick={() => onPause(scan.id)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                  title="Pause scan"
                >
                  <Pause className="w-4 h-4 text-neutral-600" />
                </button>
              )}
              {onStop && (
                <button
                  onClick={() => onStop(scan.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200 text-red-600"
                  title="Stop scan"
                >
                  <StopCircle className="w-4 h-4" />
                </button>
              )}
            </>
          )}
          
          {scan.status === 'queued' && onResume && (
            <button
              onClick={() => onResume(scan.id)}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200 text-green-600"
              title="Resume scan"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {(scan.status === 'running' || scan.status === 'completed') && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">
              Progress: {Math.round(scan.progress)}%
            </span>
            {estimatedTimeRemaining && (
              <span className="text-sm text-neutral-500">{estimatedTimeRemaining}</span>
            )}
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${scan.progress}%` }}
            >
              {scan.status === 'running' && (
                <div className="h-full bg-white/30 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timing Information */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-neutral-500">Started:</span>
          <div className="font-medium text-neutral-900 mt-1">
            {new Date(scan.startTime).toLocaleString()}
          </div>
        </div>
        
        <div>
          <span className="text-neutral-500">
            {scan.status === 'running' ? 'Duration:' : 'Total Time:'}
          </span>
          <div className="font-medium text-neutral-900 mt-1">
            {formatDuration(scan.startTime, scan.endTime)}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {scan.status === 'completed' && scan.vulnerabilities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Scan Results</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-600">{scan.summary.critical}</div>
              <div className="text-xs text-red-600">Critical</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-bold text-orange-600">{scan.summary.high}</div>
              <div className="text-xs text-orange-600">High</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-lg font-bold text-yellow-600">{scan.summary.medium}</div>
              <div className="text-xs text-yellow-600">Medium</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600">{scan.summary.low}</div>
              <div className="text-xs text-green-600">Low</div>
            </div>
          </div>
        </div>
      )}

      {/* No Vulnerabilities Found */}
      {scan.status === 'completed' && scan.vulnerabilities.length === 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-green-800">No vulnerabilities found!</div>
            <div className="text-xs text-green-600 mt-1">Your application appears to be secure.</div>
          </div>
        </div>
      )}

      {/* Scan Failed */}
      {scan.status === 'failed' && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-red-800">Scan failed</div>
            <div className="text-xs text-red-600 mt-1">
              The security scan encountered an error and could not complete.
            </div>
          </div>
        </div>
      )}

      {/* Scan Phases (for running scans) */}
      {scan.status === 'running' && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <h4 className="text-sm font-medium text-neutral-900 mb-3">Scan Phases</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${scan.progress >= 10 ? 'bg-green-500' : 'bg-neutral-300'}`} />
              <span className="text-sm text-neutral-700">Spider scan (Discovery)</span>
              {scan.progress >= 10 && scan.progress < 60 && (
                <span className="text-xs text-blue-600 animate-pulse">In progress...</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${scan.progress >= 60 ? 'bg-green-500' : 'bg-neutral-300'}`} />
              <span className="text-sm text-neutral-700">Active scan (Vulnerability testing)</span>
              {scan.progress >= 60 && scan.progress < 100 && (
                <span className="text-xs text-blue-600 animate-pulse">In progress...</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${scan.progress >= 100 ? 'bg-green-500' : 'bg-neutral-300'}`} />
              <span className="text-sm text-neutral-700">Report generation</span>
              {scan.progress >= 100 && (
                <span className="text-xs text-green-600">Complete!</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanProgress;
