import React, { useState, useEffect } from 'react';
import { Clock, Zap, Code, Shield, Play, Settings, Calendar, CheckCircle, AlertTriangle, Bug } from 'lucide-react';
import { securityService } from '../../services/security';

interface AutomatedScanConfig {
  enabled: boolean;
  schedule: 'daily' | 'weekly' | 'monthly';
  targets: string[];
  scanTypes: {
    web: boolean;
    static: boolean;
    dependencies: boolean;
  };
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: string;
  };
}

interface ScheduledScan {
  id: string;
  name: string;
  type: 'web' | 'static' | 'dependencies';
  schedule: string;
  lastRun?: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
  target: string;
}

const AutomatedScanning: React.FC = () => {
  const [config, setConfig] = useState<AutomatedScanConfig>({
    enabled: false,
    schedule: 'weekly',
    targets: ['https://your-app.com'],
    scanTypes: { web: true, static: false, dependencies: false },
    notifications: { email: true, slack: false, webhook: '' }
  });

  const [scheduledScans, setScheduledScans] = useState<ScheduledScan[]>([
    {
      id: 'web-scan-1',
      name: 'Production Web Scan',
      type: 'web',
      schedule: 'Every Monday at 2:00 AM',
      lastRun: '2024-01-15T02:00:00Z',
      nextRun: '2024-01-22T02:00:00Z',
      status: 'active',
      target: 'https://your-app.com'
    },
    {
      id: 'static-scan-1',
      name: 'Code Security Scan',
      type: 'static',
      schedule: 'Every day at 1:00 AM',
      nextRun: '2024-01-16T01:00:00Z',
      status: 'paused',
      target: 'main repository'
    }
  ]);

  const [semgrepAvailable, setSemgrepAvailable] = useState(false);

  useEffect(() => {
    // Check if Semgrep MCP is available
    checkSemgrepAvailability();
  }, []);

  const checkSemgrepAvailability = () => {
    // In a real implementation, this would check if Semgrep MCP is connected
    // For now, we'll assume it's not available and suggest connection
    setSemgrepAvailable(false);
  };

  const handleConfigChange = (updates: Partial<AutomatedScanConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleRunNow = async (scanId: string) => {
    const scan = scheduledScans.find(s => s.id === scanId);
    if (!scan) return;

    if (scan.type === 'web') {
      try {
        await securityService.startScan(scan.target, 'baseline');
        alert('Web scan started successfully!');
      } catch (error) {
        console.error('Failed to start scan:', error);
        alert('Failed to start scan. Please check your configuration.');
      }
    } else if (scan.type === 'static') {
      if (semgrepAvailable) {
        // Would integrate with Semgrep MCP here
        alert('Static code analysis started!');
      } else {
        alert('Semgrep integration not available. Please connect to Semgrep MCP for code analysis.');
      }
    }
  };

  const toggleScanStatus = (scanId: string) => {
    setScheduledScans(prev =>
      prev.map(scan =>
        scan.id === scanId
          ? { ...scan, status: scan.status === 'active' ? 'paused' : 'active' }
          : scan
      )
    );
  };

  const getScanTypeIcon = (type: ScheduledScan['type']) => {
    switch (type) {
      case 'web': return <Zap className="w-4 h-4 text-blue-600" />;
      case 'static': return <Code className="w-4 h-4 text-purple-600" />;
      case 'dependencies': return <Shield className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: ScheduledScan['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
    }
  };

  const formatNextRun = (nextRun: string) => {
    const date = new Date(nextRun);
    const now = new Date();
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return `in ${Math.ceil(diffHours)} hours`;
    } else {
      return `in ${Math.ceil(diffHours / 24)} days`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-neutral-900">Automated Security Scanning</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-neutral-600">
                {config.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => handleConfigChange({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Scan Types */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Scan Types</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.scanTypes.web}
                  onChange={(e) => handleConfigChange({
                    scanTypes: { ...config.scanTypes, web: e.target.checked }
                  })}
                  className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage"
                />
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-neutral-900">Web Application Scanning</span>
                </div>
                <span className="text-xs text-neutral-500">(OWASP ZAP)</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.scanTypes.static}
                  onChange={(e) => handleConfigChange({
                    scanTypes: { ...config.scanTypes, static: e.target.checked }
                  })}
                  className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage"
                  disabled={!semgrepAvailable}
                />
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-600" />
                  <span className={`text-sm font-medium ${semgrepAvailable ? 'text-neutral-900' : 'text-neutral-500'}`}>
                    Static Code Analysis
                  </span>
                </div>
                <span className="text-xs text-neutral-500">(Semgrep)</span>
                {!semgrepAvailable && (
                  <button
                    onClick={() => alert('Connect to Semgrep MCP to enable static code analysis')}
                    className="text-xs text-sage hover:text-sage/80 underline"
                  >
                    Connect Semgrep
                  </button>
                )}
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.scanTypes.dependencies}
                  onChange={(e) => handleConfigChange({
                    scanTypes: { ...config.scanTypes, dependencies: e.target.checked }
                  })}
                  className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage"
                />
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-neutral-900">Dependency Scanning</span>
                </div>
                <span className="text-xs text-neutral-500">(Coming soon)</span>
              </label>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Schedule</h4>
            <select
              value={config.schedule}
              onChange={(e) => handleConfigChange({ schedule: e.target.value as any })}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Targets */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Scan Targets</h4>
            <div className="space-y-2">
              {config.targets.map((target, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={target}
                    onChange={(e) => {
                      const newTargets = [...config.targets];
                      newTargets[index] = e.target.value;
                      handleConfigChange({ targets: newTargets });
                    }}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage"
                    placeholder="https://your-app.com"
                  />
                  <button
                    onClick={() => {
                      const newTargets = config.targets.filter((_, i) => i !== index);
                      handleConfigChange({ targets: newTargets });
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Remove target"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleConfigChange({ targets: [...config.targets, ''] })}
                className="text-sm text-sage hover:text-sage/80 font-medium"
              >
                + Add Target
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-3">Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.notifications.email}
                  onChange={(e) => handleConfigChange({
                    notifications: { ...config.notifications, email: e.target.checked }
                  })}
                  className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage"
                />
                <span className="text-sm text-neutral-900">Email notifications</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.notifications.slack}
                  onChange={(e) => handleConfigChange({
                    notifications: { ...config.notifications, slack: e.target.checked }
                  })}
                  className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage"
                />
                <span className="text-sm text-neutral-900">Slack notifications</span>
              </label>

              <div>
                <label className="block text-sm text-neutral-700 mb-1">Webhook URL (optional)</label>
                <input
                  type="url"
                  value={config.notifications.webhook}
                  onChange={(e) => handleConfigChange({
                    notifications: { ...config.notifications, webhook: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage"
                  placeholder="https://hooks.slack.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Scans */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
        <div className="p-6 border-b border-neutral-100">
          <h3 className="text-lg font-medium text-neutral-900">Scheduled Scans</h3>
        </div>

        <div className="divide-y divide-neutral-100">
          {scheduledScans.map((scan) => (
            <div key={scan.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getScanTypeIcon(scan.type)}
                    <h4 className="font-medium text-neutral-900">{scan.name}</h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                    <div>
                      <span className="text-neutral-500">Target:</span>
                      <div className="font-medium text-neutral-900">{scan.target}</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Schedule:</span>
                      <div className="font-medium text-neutral-900">{scan.schedule}</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Next Run:</span>
                      <div className="font-medium text-neutral-900">{formatNextRun(scan.nextRun)}</div>
                    </div>
                  </div>

                  {scan.lastRun && (
                    <div className="mt-2 text-sm text-neutral-500">
                      Last run: {new Date(scan.lastRun).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRunNow(scan.id)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                    title="Run now"
                  >
                    <Play className="w-4 h-4 text-neutral-600" />
                  </button>
                  
                  <button
                    onClick={() => toggleScanStatus(scan.id)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                    title={scan.status === 'active' ? 'Pause' : 'Resume'}
                  >
                    {scan.status === 'active' ? (
                      <Pause className="w-4 h-4 text-neutral-600" />
                    ) : (
                      <Play className="w-4 h-4 text-neutral-600" />
                    )}
                  </button>
                  
                  <button
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                    title="Configure"
                  >
                    <Settings className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semgrep Integration Notice */}
      {!semgrepAvailable && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Bug className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-purple-900 mb-2">Enhanced Code Security with Semgrep</h3>
              <p className="text-purple-800 mb-4">
                Connect to Semgrep MCP to add powerful static code analysis to your security scanning pipeline. 
                Semgrep can detect security vulnerabilities, bugs, and anti-patterns directly in your source code.
              </p>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => alert('Navigate to MCP connections to add Semgrep')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Connect Semgrep
                </button>
                <a
                  href="https://semgrep.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-500 font-medium text-sm"
                >
                  Learn more about Semgrep →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Configuration */}
      <div className="flex justify-end">
        <button
          onClick={() => alert('Configuration saved!')}
          className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default AutomatedScanning;
