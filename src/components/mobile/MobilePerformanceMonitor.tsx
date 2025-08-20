import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Wifi, Battery, Zap, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { lighthouseService, MobileOptimizationMetrics } from '../../services/lighthouse';
import { trackingService } from '../../services/tracking';

interface MobilePerformanceMonitorProps {
  url?: string;
  autoRun?: boolean;
  showRecommendations?: boolean;
}

const MobilePerformanceMonitor: React.FC<MobilePerformanceMonitorProps> = ({
  url = window.location.href,
  autoRun = true,
  showRecommendations = true
}) => {
  const [metrics, setMetrics] = useState<MobileOptimizationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Array<{
    category: string;
    issue: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }>>([]);

  useEffect(() => {
    if (autoRun) {
      runPerformanceTest();
    }
  }, [autoRun, url]);

  const runPerformanceTest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Track that a performance test was initiated
      await trackingService.trackEvent('performance_test_started', 'performance', {
        url,
        test_type: 'mobile_optimization'
      });

      const result = await lighthouseService.analyzeMobilePerformance(url);
      setMetrics(result);
      setLastUpdated(new Date());

      const recs = lighthouseService.getRecommendations(result);
      setRecommendations(recs);

      // Track performance test completion
      await trackingService.trackEvent('performance_test_completed', 'performance', {
        url,
        performance_score: result.performance,
        accessibility_score: result.accessibility,
        mobile_usability: result.mobileUsability,
        recommendations_count: recs.length
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run performance test';
      setError(errorMessage);
      
      // Track performance test error
      await trackingService.trackEvent('performance_test_error', 'error', {
        url,
        error: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4" />;
    if (score >= 70) return <TrendingUp className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
    }
  };

  const formatTime = (time: number) => {
    if (time < 1000) return `${Math.round(time)}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900">Mobile Performance Monitor</h3>
              <p className="text-sm text-neutral-600">Real-time mobile optimization analysis</p>
            </div>
          </div>
          
          <button
            onClick={runPerformanceTest}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            <Monitor className="w-4 h-4" />
            <span>{isLoading ? 'Testing...' : 'Run Test'}</span>
          </button>
        </div>
        
        {lastUpdated && (
          <div className="mt-3 text-xs text-neutral-500">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        )}
      </div>

      <div className="p-6">
        {isLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 bg-blue-100 rounded-full animate-spin mx-auto mb-3 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-neutral-600">Analyzing mobile performance...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Performance Test Failed</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {metrics && (
          <div className="space-y-6">
            {/* Core Scores */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium ${getScoreColor(metrics.performance)}`}>
                  {getScoreIcon(metrics.performance)}
                  <span>{metrics.performance}</span>
                </div>
                <div className="text-xs text-neutral-600 mt-1">Performance</div>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium ${getScoreColor(metrics.accessibility)}`}>
                  {getScoreIcon(metrics.accessibility)}
                  <span>{metrics.accessibility}</span>
                </div>
                <div className="text-xs text-neutral-600 mt-1">Accessibility</div>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium ${getScoreColor(metrics.bestPractices)}`}>
                  {getScoreIcon(metrics.bestPractices)}
                  <span>{metrics.bestPractices}</span>
                </div>
                <div className="text-xs text-neutral-600 mt-1">Best Practices</div>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium ${getScoreColor(metrics.seo)}`}>
                  {getScoreIcon(metrics.seo)}
                  <span>{metrics.seo}</span>
                </div>
                <div className="text-xs text-neutral-600 mt-1">SEO</div>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium ${getScoreColor(metrics.mobileUsability)}`}>
                  {getScoreIcon(metrics.mobileUsability)}
                  <span>{metrics.mobileUsability}</span>
                </div>
                <div className="text-xs text-neutral-600 mt-1">Mobile Usability</div>
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="border border-neutral-200 rounded-xl p-4">
              <h4 className="font-medium text-neutral-900 mb-3 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Core Web Vitals</span>
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-900">{formatTime(metrics.firstContentfulPaint * 1000)}</div>
                  <div className="text-xs text-neutral-600">First Contentful Paint</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-900">{formatTime(metrics.largestContentfulPaint * 1000)}</div>
                  <div className="text-xs text-neutral-600">Largest Contentful Paint</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-900">{formatTime(metrics.totalBlockingTime)}</div>
                  <div className="text-xs text-neutral-600">Total Blocking Time</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-neutral-900">{metrics.cumulativeLayoutShift.toFixed(3)}</div>
                  <div className="text-xs text-neutral-600">Cumulative Layout Shift</div>
                </div>
              </div>
            </div>

            {/* Mobile-Specific Metrics */}
            <div className="border border-neutral-200 rounded-xl p-4">
              <h4 className="font-medium text-neutral-900 mb-3 flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-green-600" />
                <span>Mobile Optimization</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-600">Touch Target Size</span>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getScoreColor(metrics.touchTargetSize)}`}>
                    {metrics.touchTargetSize}%
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-600">Viewport Config</span>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${metrics.viewportConfig ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    {metrics.viewportConfig ? 'Optimized' : 'Needs Fix'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-600">Speed Index</span>
                  <span className="text-sm font-medium text-neutral-900">{formatTime(metrics.speedIndex * 1000)}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {showRecommendations && recommendations.length > 0 && (
              <div className="border border-neutral-200 rounded-xl p-4">
                <h4 className="font-medium text-neutral-900 mb-3 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span>Optimization Recommendations</span>
                </h4>
                
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border border-neutral-100 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-neutral-900">{rec.category}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                            {rec.priority}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-700 mb-1">{rec.issue}</div>
                      <div className="text-xs text-neutral-600">{rec.recommendation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePerformanceMonitor;
