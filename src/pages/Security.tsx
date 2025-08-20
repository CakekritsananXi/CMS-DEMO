import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Play, StopCircle, FileText, Settings, Zap, Bug, TrendingUp, TrendingDown, Minus, X, Smartphone } from 'lucide-react';
import { securityService, ScanResult, SecurityMetrics, Vulnerability } from '../services/security';
import { trackingService } from '../services/tracking';
import ErrorBoundary from '../components/ErrorBoundary';
import { Loading, LoadingOverlay } from '../components/Loading';
import AutomatedScanning from '../components/security/AutomatedScanning';
import MobilePerformanceMonitor from '../components/mobile/MobilePerformanceMonitor';
import TrackingConfiguration from '../components/analytics/TrackingConfiguration';
import { getDeviceCapabilities } from '../utils/mobile';

const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scans' | 'automated' | 'reports' | 'settings' | 'mobile'>('dashboard');
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newScanTarget, setNewScanTarget] = useState('');
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState(getDeviceCapabilities());

  useEffect(() => {
    initializeSecurity();
    
    // Track page view with device information
    trackingService.trackPageView('/security').then(() => {
      trackingService.trackEvent('security_page_loaded', 'page_view', {
        device_type: deviceCapabilities.isMobile ? 'mobile' : deviceCapabilities.isTablet ? 'tablet' : 'desktop',
        screen_size: `${deviceCapabilities.screenSize.width}x${deviceCapabilities.screenSize.height}`,
        viewport_size: `${deviceCapabilities.viewport.width}x${deviceCapabilities.viewport.height}`,
        is_touch_device: deviceCapabilities.isTouchDevice,
        connection_speed: deviceCapabilities.connectionSpeed
      });
    });
  }, []);

  const initializeSecurity = async () => {
    setIsLoading(true);
    try {
      await securityService.initialize();
      refreshData();
    } catch (error) {
      console.error('Failed to initialize security service:', error);
      refreshData();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    try {
      setScans(securityService.getScans());
      setMetrics(securityService.getSecurityMetrics());
    } catch (error) {
      console.error('Error refreshing security data:', error);
      setScans([]);
      setMetrics({
        totalScans: 0,
        activeScans: 0,
        totalVulnerabilities: 0,
        criticalVulnerabilities: 0,
        securityScore: 100,
        riskTrend: 'stable',
        lastScanDate: 'Never'
      });
    }
  };

  const handleTabChange = async (tab: typeof activeTab) => {
    setActiveTab(tab);
    
    // Track tab navigation
    await trackingService.trackEvent('security_tab_changed', 'user_action', {
      from_tab: activeTab,
      to_tab: tab,
      device_type: deviceCapabilities.device_type
    });
  };

  const handleStartScan = async (target: string, scanType: 'spider' | 'active' | 'baseline' = 'baseline') => {
    if (!target.trim()) return;

    try {
      // Track scan initiation
      await trackingService.trackEvent('security_scan_started', 'user_action', {
        scan_type: scanType,
        target_url: target,
        device_type: deviceCapabilities.device_type
      });

      await securityService.startScan(target, scanType);
      setNewScanTarget('');

      const interval = setInterval(() => {
        try {
          refreshData();
          const runningScans = securityService.getScans().filter(s => s.status === 'running');
          if (runningScans.length === 0) {
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error refreshing scan data:', error);
          clearInterval(interval);
        }
      }, 2000);

      refreshData();
    } catch (error) {
      console.error('Failed to start scan:', error);
      
      // Track scan error
      await trackingService.trackEvent('security_scan_error', 'error', {
        scan_type: scanType,
        target_url: target,
        error: error.message || 'Unknown error',
        device_type: deviceCapabilities.device_type
      });
      
      alert(`Failed to start scan: ${error.message || 'Unknown error'}`);
    }
  };

  const handleStopScan = async (scanId: string) => {
    await securityService.stopScan(scanId);
    await trackingService.trackEvent('security_scan_stopped', 'user_action', {
      scan_id: scanId,
      device_type: deviceCapabilities.device_type
    });
    refreshData();
  };

  const handleDeleteScan = async (scanId: string) => {
    securityService.deleteScan(scanId);
    await trackingService.trackEvent('security_scan_deleted', 'user_action', {
      scan_id: scanId,
      device_type: deviceCapabilities.device_type
    });
    refreshData();
  };

  const getRiskColor = (risk: Vulnerability['risk']) => {
    switch (risk) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusColor = (status: ScanResult['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'queued': return 'text-neutral-600 bg-neutral-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getTrendIcon = (trend: SecurityMetrics['riskTrend']) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-neutral-500" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="mobile-grid">
        <div className="mobile-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{metrics?.securityScore || 0}</span>
          </div>
          <div className="text-responsive-sm text-neutral-600">Security Score</div>
          <div className="text-xs text-neutral-500 mt-1">
            {(metrics?.securityScore || 0) >= 80 ? 'Excellent' : 
             (metrics?.securityScore || 0) >= 60 ? 'Good' : 
             (metrics?.securityScore || 0) >= 40 ? 'Fair' : 'Poor'}
          </div>
        </div>

        <div className="mobile-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">{metrics?.totalVulnerabilities || 0}</span>
          </div>
          <div className="text-responsive-sm text-neutral-600">Total Vulnerabilities</div>
          <div className="flex items-center space-x-1 mt-1">
            {getTrendIcon(metrics?.riskTrend || 'stable')}
            <span className="text-xs text-neutral-500 capitalize">{metrics?.riskTrend || 'stable'}</span>
          </div>
        </div>

        <div className="mobile-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Bug className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">{metrics?.criticalVulnerabilities || 0}</span>
          </div>
          <div className="text-responsive-sm text-neutral-600">Critical Issues</div>
          <div className="text-xs text-neutral-500 mt-1">Require immediate attention</div>
        </div>

        <div className="mobile-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">{metrics?.activeScans || 0}</span>
          </div>
          <div className="text-responsive-sm text-neutral-600">Active Scans</div>
          <div className="text-xs text-neutral-500 mt-1">Currently running</div>
        </div>
      </div>

      {/* Quick Start Scan */}
      <div className="mobile-card">
        <div className="border-b border-neutral-100 pb-4 mb-4">
          <h3 className="text-responsive-lg font-medium text-neutral-900 mb-2">Quick Security Scan</h3>
          <p className="text-responsive-sm text-neutral-600">Start a new security scan to identify vulnerabilities</p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="url"
                value={newScanTarget}
                onChange={(e) => setNewScanTarget(e.target.value)}
                placeholder="Enter target URL (e.g., https://your-app.com)"
                className="mobile-input"
              />
            </div>
            <button
              onClick={() => handleStartScan(newScanTarget, 'baseline')}
              disabled={!newScanTarget.trim()}
              className="mobile-button-primary flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              <span>Start Scan</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => handleStartScan(newScanTarget, 'spider')}
              disabled={!newScanTarget.trim()}
              className="mobile-button-secondary text-xs sm:text-sm"
            >
              Spider Scan
            </button>
            <button
              onClick={() => handleStartScan(newScanTarget, 'active')}
              disabled={!newScanTarget.trim()}
              className="mobile-button-secondary text-xs sm:text-sm"
            >
              Active Scan
            </button>
            <button
              onClick={() => handleStartScan(newScanTarget, 'baseline')}
              disabled={!newScanTarget.trim()}
              className="mobile-button-secondary text-xs sm:text-sm"
            >
              Baseline Scan
            </button>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="mobile-card">
        <div className="border-b border-neutral-100 pb-4 mb-4">
          <h3 className="text-responsive-lg font-medium text-neutral-900">Recent Scans</h3>
        </div>
        <div className="space-y-4">
          {scans.slice(0, 5).map((scan) => (
            <div key={scan.id} className="border border-neutral-100 rounded-xl p-4 hover:bg-neutral-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-neutral-900 truncate">{scan.target}</h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(scan.status)} whitespace-nowrap`}>
                      {scan.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-neutral-600">
                    <div>Started: {new Date(scan.startTime).toLocaleString()}</div>
                    {scan.endTime && (
                      <div>Completed: {new Date(scan.endTime).toLocaleString()}</div>
                    )}
                    {scan.status === 'running' && (
                      <div>Progress: {Math.round(scan.progress)}%</div>
                    )}
                  </div>
                  {scan.status === 'completed' && (
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm">
                      <span className="text-red-600">{scan.summary.critical} Critical</span>
                      <span className="text-orange-600">{scan.summary.high} High</span>
                      <span className="text-yellow-600">{scan.summary.medium} Medium</span>
                      <span className="text-green-600">{scan.summary.low} Low</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  {scan.status === 'running' && (
                    <button
                      onClick={() => handleStopScan(scan.id)}
                      className="touch-target p-2 hover:bg-neutral-200 rounded-lg transition-colors duration-200"
                      title="Stop scan"
                    >
                      <StopCircle className="w-4 h-4 text-neutral-600" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedScan(scan)}
                    className="touch-target p-2 hover:bg-neutral-200 rounded-lg transition-colors duration-200"
                    title="View details"
                  >
                    <FileText className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
              </div>
              {scan.status === 'running' && (
                <div className="mt-3">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-sage h-2 rounded-full transition-all duration-500"
                      style={{ width: `${scan.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {scans.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-responsive-lg font-medium text-neutral-900 mb-2">No scans yet</h3>
              <p className="text-responsive-sm text-neutral-600">Start your first security scan to identify vulnerabilities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderScans = () => (
    <div className="mobile-card p-0 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <h3 className="text-responsive-lg font-medium text-neutral-900">All Security Scans</h3>
          <button
            onClick={refreshData}
            className="text-sm text-sage hover:text-sage/80 transition-colors duration-200 touch-target"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto webkit-scrolling-touch">
        <div className="min-w-full">
          {/* Mobile-first table layout */}
          <div className="block sm:hidden">
            {scans.map((scan) => (
              <div key={scan.id} className="border-b border-neutral-100 p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-neutral-900 truncate">{scan.target}</div>
                      <div className="text-xs text-neutral-600 mt-1">{scan.id}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ml-2 ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600">
                    Started: {new Date(scan.startTime).toLocaleString()}
                  </div>

                  {scan.status === 'completed' && (
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-red-600">{scan.summary.critical}C</span>
                      <span className="text-orange-600">{scan.summary.high}H</span>
                      <span className="text-yellow-600">{scan.summary.medium}M</span>
                      <span className="text-green-600">{scan.summary.low}L</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="text-xs text-sage hover:text-sage/80 transition-colors duration-200 touch-target"
                      >
                        View
                      </button>
                      {scan.status === 'running' && (
                        <button
                          onClick={() => handleStopScan(scan.id)}
                          className="text-xs text-red-600 hover:text-red-500 transition-colors duration-200 touch-target"
                        >
                          Stop
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteScan(scan.id)}
                        className="text-xs text-red-600 hover:text-red-500 transition-colors duration-200 touch-target"
                      >
                        Delete
                      </button>
                    </div>
                    {scan.status === 'running' && (
                      <div className="text-xs text-neutral-600">{Math.round(scan.progress)}%</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table layout */}
          <table className="hidden sm:table w-full">
            <thead className="bg-neutral-50/50">
              <tr>
                <th className="text-left p-4 font-medium text-neutral-700">Target</th>
                <th className="text-left p-4 font-medium text-neutral-700">Status</th>
                <th className="text-left p-4 font-medium text-neutral-700">Started</th>
                <th className="text-left p-4 font-medium text-neutral-700">Vulnerabilities</th>
                <th className="text-left p-4 font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-neutral-50 transition-colors duration-200">
                  <td className="p-4">
                    <div className="font-medium text-neutral-900">{scan.target}</div>
                    <div className="text-sm text-neutral-600">{scan.id}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                    {scan.status === 'running' && (
                      <div className="mt-1 text-xs text-neutral-600">{Math.round(scan.progress)}% complete</div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-neutral-600">
                    {new Date(scan.startTime).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {scan.status === 'completed' ? (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-red-600">{scan.summary.critical}C</span>
                        <span className="text-orange-600">{scan.summary.high}H</span>
                        <span className="text-yellow-600">{scan.summary.medium}M</span>
                        <span className="text-green-600">{scan.summary.low}L</span>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-500">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="text-sm text-sage hover:text-sage/80 transition-colors duration-200 touch-target"
                      >
                        View
                      </button>
                      {scan.status === 'running' && (
                        <button
                          onClick={() => handleStopScan(scan.id)}
                          className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200 touch-target"
                        >
                          Stop
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteScan(scan.id)}
                        className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200 touch-target"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="mobile-card text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-responsive-lg font-medium text-neutral-900 mb-2">Security Reports</h3>
        <p className="text-responsive-sm text-neutral-600 mb-6">Generate comprehensive security reports from your scans.</p>

        <div className="mobile-grid max-w-2xl mx-auto">
          <button className="mobile-card hover:bg-neutral-50 transition-colors duration-200 text-center">
            <div className="text-sm font-medium text-neutral-900 mb-1">Executive Summary</div>
            <div className="text-xs text-neutral-600">High-level security overview</div>
          </button>
          <button className="mobile-card hover:bg-neutral-50 transition-colors duration-200 text-center">
            <div className="text-sm font-medium text-neutral-900 mb-1">Technical Report</div>
            <div className="text-xs text-neutral-600">Detailed vulnerability analysis</div>
          </button>
          <button className="mobile-card hover:bg-neutral-50 transition-colors duration-200 text-center">
            <div className="text-sm font-medium text-neutral-900 mb-1">Compliance Report</div>
            <div className="text-xs text-neutral-600">OWASP Top 10 mapping</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="mobile-card">
        <div className="border-b border-neutral-100 pb-4 mb-6">
          <h3 className="text-responsive-lg font-medium text-neutral-900">OWASP ZAP Configuration</h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">ZAP API URL</label>
            <input
              type="url"
              defaultValue="http://localhost:8080"
              className="mobile-input"
            />
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">URL of your OWASP ZAP instance</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">API Key</label>
            <input
              type="password"
              placeholder="Enter ZAP API key (optional)"
              className="mobile-input"
            />
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">API key for authenticated access</p>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
            <div className={`w-3 h-3 rounded-full ${securityService.isZAPConnected() ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs sm:text-sm text-neutral-700">
              {securityService.isZAPConnected() ? 'Connected to ZAP' : 'ZAP not connected (using demo mode)'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="mobile-button-primary">
              Save Configuration
            </button>
            <button className="mobile-button-secondary">
              Test Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileOptimization = () => (
    <div className="space-y-6">
      <TrackingConfiguration />
      <MobilePerformanceMonitor
        autoRun={false}
        showRecommendations={true}
      />
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'scans', label: 'Scans', icon: Zap },
    { id: 'automated', label: 'Auto', icon: Clock },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  if (isLoading) {
    return <Loading text="Initializing security tools..." fullScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="mobile-container mobile-section pb-safe">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-responsive-2xl font-bold text-neutral-900 mb-2">Security Center</h1>
            <p className="text-responsive-sm text-neutral-600">Automated security scanning and vulnerability management</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm ${
              securityService.isZAPConnected() ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                securityService.isZAPConnected() ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="font-medium">
                {securityService.isZAPConnected() ? 'ZAP Connected' : 'Demo Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mobile-card mb-6 sm:mb-8 p-0 overflow-hidden">
          <div className="flex border-b border-neutral-100 overflow-x-auto webkit-scrolling-touch">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 font-medium transition-all duration-200 whitespace-nowrap touch-target flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'text-sage border-b-2 border-sage bg-sage/5'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.id === 'scans' && metrics && metrics.activeScans > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      {metrics.activeScans}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'scans' && renderScans()}
          {activeTab === 'automated' && <AutomatedScanning />}
          {activeTab === 'mobile' && renderMobileOptimization()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Mobile-Optimized Scan Details Modal */}
        {selectedScan && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
            <div className="mobile-modal-content max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-responsive-lg font-medium text-neutral-900">Scan Details</h3>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="touch-target p-1 text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] webkit-scrolling-touch">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-3">Scan Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Target:</span>
                        <div className="font-medium text-neutral-900 break-all">{selectedScan.target}</div>
                      </div>
                      <div>
                        <span className="text-neutral-600">Status:</span>
                        <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mt-1 ${getStatusColor(selectedScan.status)}`}>
                          {selectedScan.status}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-600">Started:</span>
                        <div className="font-medium text-neutral-900">{new Date(selectedScan.startTime).toLocaleString()}</div>
                      </div>
                      {selectedScan.endTime && (
                        <div>
                          <span className="text-neutral-600">Completed:</span>
                          <div className="font-medium text-neutral-900">{new Date(selectedScan.endTime).toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedScan.vulnerabilities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-4">Vulnerabilities Found</h4>
                      <div className="space-y-4">
                        {selectedScan.vulnerabilities.map((vuln) => (
                          <div key={vuln.id} className="border border-neutral-200 rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-2 sm:space-y-0">
                              <h5 className="font-medium text-neutral-900">{vuln.name}</h5>
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium self-start ${getRiskColor(vuln.risk)}`}>
                                {vuln.risk}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600 mb-3">{vuln.description}</p>
                            {vuln.url && (
                              <div className="text-sm text-neutral-700 mb-2">
                                <span className="font-medium">URL:</span> 
                                <span className="break-all ml-1">{vuln.url}</span>
                              </div>
                            )}
                            {vuln.solution && (
                              <div className="text-sm text-neutral-700">
                                <span className="font-medium">Solution:</span> {vuln.solution}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Security;
