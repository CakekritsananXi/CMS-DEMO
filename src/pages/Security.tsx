import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Play, StopCircle, FileText, Settings, Zap, Bug, TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { securityService, ScanResult, SecurityMetrics, Vulnerability } from '../services/security';
import ErrorBoundary from '../components/ErrorBoundary';
import { Loading, LoadingOverlay } from '../components/Loading';
import AutomatedScanning from '../components/security/AutomatedScanning';

const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scans' | 'automated' | 'reports' | 'settings'>('dashboard');
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newScanTarget, setNewScanTarget] = useState('');
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    setIsLoading(true);
    try {
      await securityService.initialize();
      refreshData();
    } catch (error) {
      console.error('Failed to initialize security service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    setScans(securityService.getScans());
    setMetrics(securityService.getSecurityMetrics());
  };

  const handleStartScan = async (target: string, scanType: 'spider' | 'active' | 'baseline' = 'baseline') => {
    if (!target.trim()) return;

    try {
      await securityService.startScan(target, scanType);
      setNewScanTarget('');
      
      // Refresh data periodically while scans are running
      const interval = setInterval(() => {
        refreshData();
        const runningScans = securityService.getScans().filter(s => s.status === 'running');
        if (runningScans.length === 0) {
          clearInterval(interval);
        }
      }, 2000);

      refreshData();
    } catch (error) {
      console.error('Failed to start scan:', error);
    }
  };

  const handleStopScan = async (scanId: string) => {
    await securityService.stopScan(scanId);
    refreshData();
  };

  const handleDeleteScan = (scanId: string) => {
    securityService.deleteScan(scanId);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{metrics?.securityScore || 0}</span>
          </div>
          <div className="text-sm text-neutral-600">Security Score</div>
          <div className="text-xs text-neutral-500 mt-1">
            {(metrics?.securityScore || 0) >= 80 ? 'Excellent' : 
             (metrics?.securityScore || 0) >= 60 ? 'Good' : 
             (metrics?.securityScore || 0) >= 40 ? 'Fair' : 'Poor'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">{metrics?.totalVulnerabilities || 0}</span>
          </div>
          <div className="text-sm text-neutral-600">Total Vulnerabilities</div>
          <div className="flex items-center space-x-1 mt-1">
            {getTrendIcon(metrics?.riskTrend || 'stable')}
            <span className="text-xs text-neutral-500 capitalize">{metrics?.riskTrend || 'stable'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Bug className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">{metrics?.criticalVulnerabilities || 0}</span>
          </div>
          <div className="text-sm text-neutral-600">Critical Issues</div>
          <div className="text-xs text-neutral-500 mt-1">Require immediate attention</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">{metrics?.activeScans || 0}</span>
          </div>
          <div className="text-sm text-neutral-600">Active Scans</div>
          <div className="text-xs text-neutral-500 mt-1">Currently running</div>
        </div>
      </div>

      {/* Quick Start Scan */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
        <div className="p-6 border-b border-neutral-100">
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Quick Security Scan</h3>
          <p className="text-neutral-600">Start a new security scan to identify vulnerabilities</p>
        </div>
        <div className="p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="url"
                value={newScanTarget}
                onChange={(e) => setNewScanTarget(e.target.value)}
                placeholder="Enter target URL (e.g., https://your-app.com)"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
              />
            </div>
            <button
              onClick={() => handleStartScan(newScanTarget, 'baseline')}
              disabled={!newScanTarget.trim()}
              className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Scan</span>
            </button>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => handleStartScan(newScanTarget, 'spider')}
              disabled={!newScanTarget.trim()}
              className="border border-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Spider Scan
            </button>
            <button
              onClick={() => handleStartScan(newScanTarget, 'active')}
              disabled={!newScanTarget.trim()}
              className="border border-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Active Scan
            </button>
            <button
              onClick={() => handleStartScan(newScanTarget, 'baseline')}
              disabled={!newScanTarget.trim()}
              className="border border-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Baseline Scan
            </button>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
        <div className="p-6 border-b border-neutral-100">
          <h3 className="text-lg font-medium text-neutral-900">Recent Scans</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {scans.slice(0, 5).map((scan) => (
            <div key={scan.id} className="p-6 hover:bg-neutral-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-neutral-900">{scan.target}</h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span>Started: {new Date(scan.startTime).toLocaleString()}</span>
                    {scan.endTime && (
                      <span>Completed: {new Date(scan.endTime).toLocaleString()}</span>
                    )}
                    {scan.status === 'running' && (
                      <span>Progress: {Math.round(scan.progress)}%</span>
                    )}
                  </div>
                  {scan.status === 'completed' && (
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-red-600">{scan.summary.critical} Critical</span>
                      <span className="text-sm text-orange-600">{scan.summary.high} High</span>
                      <span className="text-sm text-yellow-600">{scan.summary.medium} Medium</span>
                      <span className="text-sm text-green-600">{scan.summary.low} Low</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {scan.status === 'running' && (
                    <button
                      onClick={() => handleStopScan(scan.id)}
                      className="p-2 hover:bg-neutral-200 rounded-lg transition-colors duration-200"
                      title="Stop scan"
                    >
                      <StopCircle className="w-4 h-4 text-neutral-600" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedScan(scan)}
                    className="p-2 hover:bg-neutral-200 rounded-lg transition-colors duration-200"
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
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No scans yet</h3>
              <p className="text-neutral-600">Start your first security scan to identify vulnerabilities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderScans = () => (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">All Security Scans</h3>
          <button
            onClick={refreshData}
            className="text-sm text-sage hover:text-sage/80 transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
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
                      className="text-sm text-sage hover:text-sage/80 transition-colors duration-200"
                    >
                      View
                    </button>
                    {scan.status === 'running' && (
                      <button
                        onClick={() => handleStopScan(scan.id)}
                        className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200"
                      >
                        Stop
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteScan(scan.id)}
                      className="text-sm text-red-600 hover:text-red-500 transition-colors duration-200"
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
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft p-8 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Security Reports</h3>
        <p className="text-neutral-600 mb-6">Generate comprehensive security reports from your scans.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <button className="p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors duration-200">
            <div className="text-sm font-medium text-neutral-900 mb-1">Executive Summary</div>
            <div className="text-xs text-neutral-600">High-level security overview</div>
          </button>
          <button className="p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors duration-200">
            <div className="text-sm font-medium text-neutral-900 mb-1">Technical Report</div>
            <div className="text-xs text-neutral-600">Detailed vulnerability analysis</div>
          </button>
          <button className="p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors duration-200">
            <div className="text-sm font-medium text-neutral-900 mb-1">Compliance Report</div>
            <div className="text-xs text-neutral-600">OWASP Top 10 mapping</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
        <div className="p-6 border-b border-neutral-100">
          <h3 className="text-lg font-medium text-neutral-900">OWASP ZAP Configuration</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">ZAP API URL</label>
            <input
              type="url"
              defaultValue="http://localhost:8080"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
            />
            <p className="text-sm text-neutral-600 mt-1">URL of your OWASP ZAP instance</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">API Key</label>
            <input
              type="password"
              placeholder="Enter ZAP API key (optional)"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
            />
            <p className="text-sm text-neutral-600 mt-1">API key for authenticated access</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${securityService.isZAPConnected() ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-neutral-700">
              {securityService.isZAPConnected() ? 'Connected to ZAP' : 'ZAP not connected (using demo mode)'}
            </span>
          </div>

          <div className="flex space-x-3">
            <button className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200">
              Save Configuration
            </button>
            <button className="border border-neutral-200 text-neutral-700 px-6 py-3 rounded-xl font-medium hover:bg-neutral-50 transition-colors duration-200">
              Test Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'scans', label: 'Scans', icon: Zap },
    { id: 'automated', label: 'Automated', icon: Clock },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  if (isLoading) {
    return <Loading text="Initializing security tools..." fullScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Security Center</h1>
            <p className="text-neutral-600">Automated security scanning and vulnerability management</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              securityService.isZAPConnected() ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                securityService.isZAPConnected() ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-sm font-medium">
                {securityService.isZAPConnected() ? 'ZAP Connected' : 'Demo Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-neutral-200 mb-8 shadow-soft">
          <div className="flex border-b border-neutral-100 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-sage border-b-2 border-sage bg-sage/5'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
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
        <div className="min-h-[600px]">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'scans' && renderScans()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Scan Details Modal */}
        {selectedScan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-900">Scan Details</h3>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">Scan Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Target:</span>
                        <div className="font-medium text-neutral-900">{selectedScan.target}</div>
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
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-neutral-900">{vuln.name}</h5>
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getRiskColor(vuln.risk)}`}>
                                {vuln.risk}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600 mb-3">{vuln.description}</p>
                            {vuln.url && (
                              <div className="text-sm text-neutral-700 mb-2">
                                <span className="font-medium">URL:</span> {vuln.url}
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
