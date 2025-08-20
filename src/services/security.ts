interface ZAPConfig {
  baseUrl: string;
  apiKey?: string;
  proxy?: {
    host: string;
    port: number;
  };
}

export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: 'Low' | 'Medium' | 'High';
  url: string;
  param?: string;
  attack?: string;
  evidence?: string;
  solution: string;
  reference: string;
  cweid?: string;
  wascid?: string;
  sourceid?: string;
}

export interface ScanResult {
  id: string;
  target: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
  vulnerabilities: Vulnerability[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface SecurityMetrics {
  totalScans: number;
  activeScans: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  securityScore: number;
  riskTrend: 'increasing' | 'decreasing' | 'stable';
  lastScanDate: string;
}

class SecurityService {
  private config: ZAPConfig;
  private scans: Map<string, ScanResult> = new Map();
  private isConnected: boolean = false;

  constructor(config: ZAPConfig = {
    baseUrl: 'http://localhost:8080',
    apiKey: import.meta.env.VITE_ZAP_API_KEY
  }) {
    this.config = config;
  }

  // Initialize and test connection to ZAP
  async initialize(): Promise<boolean> {
    try {
      const response = await this.makeZAPRequest('/JSON/core/view/version/');
      if (response.version) {
        this.isConnected = true;
        console.log('Connected to OWASP ZAP:', response.version);
        return true;
      }
    } catch (error) {
      console.warn('ZAP not available, using mock data for demo:', error?.message || 'Connection failed');
      this.isConnected = false;
      this.initializeMockData();
      return false;
    }
    return false;
  }

  // Make HTTP request to ZAP API
  private async makeZAPRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    try {
      const url = new URL(`${this.config.baseUrl}${endpoint}`);

      // Add API key if configured
      if (this.config.apiKey) {
        params.apikey = this.config.apiKey;
      }

      // Add parameters to URL
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`ZAP API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Handle network errors, timeouts, and other fetch failures
      if (error.name === 'AbortError') {
        throw new Error('ZAP API request timeout');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to ZAP - service not available');
      }
      throw error;
    }
  }

  // Start a new security scan
  async startScan(target: string, scanType: 'spider' | 'active' | 'baseline' = 'baseline'): Promise<string> {
    const scanId = `scan-${Date.now()}`;

    if (this.isConnected) {
      try {
        // Start spider scan first
        await this.makeZAPRequest('/JSON/spider/action/scan/', { url: target });
        
        if (scanType === 'active') {
          // Start active scan
          await this.makeZAPRequest('/JSON/ascan/action/scan/', { url: target });
        }

        // Create scan record
        const scan: ScanResult = {
          id: scanId,
          target,
          status: 'running',
          progress: 0,
          startTime: new Date().toISOString(),
          vulnerabilities: [],
          summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
        };

        this.scans.set(scanId, scan);
        
        // Start polling for updates
        this.pollScanProgress(scanId);
        
        return scanId;
      } catch (error) {
        console.error('Failed to start ZAP scan:', error);
        throw error;
      }
    } else {
      // Use mock scan for demo
      return this.startMockScan(target, scanType);
    }
  }

  // Start mock scan for demo purposes
  private async startMockScan(target: string, scanType: string): Promise<string> {
    const scanId = `mock-scan-${Date.now()}`;
    
    const scan: ScanResult = {
      id: scanId,
      target,
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      vulnerabilities: [],
      summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
    };

    this.scans.set(scanId, scan);

    // Simulate scan progress
    this.simulateScanProgress(scanId);

    return scanId;
  }

  // Simulate scan progress for demo
  private simulateScanProgress(scanId: string): void {
    const scan = this.scans.get(scanId);
    if (!scan) return;

    const progressInterval = setInterval(() => {
      scan.progress += Math.random() * 15;
      
      if (scan.progress >= 100) {
        scan.progress = 100;
        scan.status = 'completed';
        scan.endTime = new Date().toISOString();
        scan.vulnerabilities = this.generateMockVulnerabilities();
        scan.summary = this.calculateSummary(scan.vulnerabilities);
        clearInterval(progressInterval);
      }

      this.scans.set(scanId, scan);
    }, 1000);
  }

  // Poll ZAP for scan progress
  private async pollScanProgress(scanId: string): Promise<void> {
    const scan = this.scans.get(scanId);
    if (!scan) return;

    const pollInterval = setInterval(async () => {
      try {
        // Get spider progress
        const spiderStatus = await this.makeZAPRequest('/JSON/spider/view/status/');
        const spiderProgress = parseInt(spiderStatus.status) || 0;

        // Get active scan progress if running
        let activeScanProgress = 100;
        try {
          const activeScanStatus = await this.makeZAPRequest('/JSON/ascan/view/status/');
          activeScanProgress = parseInt(activeScanStatus.status) || 100;
        } catch (error) {
          // Active scan might not be running
        }

        // Calculate overall progress
        scan.progress = Math.min(spiderProgress, activeScanProgress);

        if (scan.progress >= 100) {
          scan.status = 'completed';
          scan.endTime = new Date().toISOString();
          
          // Get alerts/vulnerabilities
          const alerts = await this.makeZAPRequest('/JSON/core/view/alerts/');
          scan.vulnerabilities = this.parseZAPAlerts(alerts.alerts || []);
          scan.summary = this.calculateSummary(scan.vulnerabilities);
          
          clearInterval(pollInterval);
        }

        this.scans.set(scanId, scan);
      } catch (error) {
        console.error('Error polling scan progress:', error);
        scan.status = 'failed';
        clearInterval(pollInterval);
      }
    }, 2000);
  }

  // Parse ZAP alerts into our vulnerability format
  private parseZAPAlerts(alerts: any[]): Vulnerability[] {
    return alerts.map((alert, index) => ({
      id: `vuln-${index}`,
      name: alert.name || alert.alert,
      description: alert.description || '',
      risk: this.mapZAPRisk(alert.risk),
      confidence: this.mapZAPConfidence(alert.confidence),
      url: alert.url || '',
      param: alert.param || '',
      attack: alert.attack || '',
      evidence: alert.evidence || '',
      solution: alert.solution || '',
      reference: alert.reference || '',
      cweid: alert.cweid,
      wascid: alert.wascid,
      sourceid: alert.sourceid
    }));
  }

  // Map ZAP risk levels
  private mapZAPRisk(risk: string): Vulnerability['risk'] {
    switch (risk?.toLowerCase()) {
      case '3': case 'high': return 'High';
      case '2': case 'medium': return 'Medium';
      case '1': case 'low': return 'Low';
      case '0': case 'informational': return 'Low';
      default: return 'Medium';
    }
  }

  // Map ZAP confidence levels
  private mapZAPConfidence(confidence: string): Vulnerability['confidence'] {
    switch (confidence?.toLowerCase()) {
      case '3': case 'high': return 'High';
      case '2': case 'medium': return 'Medium';
      case '1': case 'low': return 'Low';
      default: return 'Medium';
    }
  }

  // Generate mock vulnerabilities for demo
  private generateMockVulnerabilities(): Vulnerability[] {
    const mockVulns: Vulnerability[] = [
      {
        id: 'vuln-1',
        name: 'Cross-Site Scripting (XSS)',
        description: 'The page contains a potential XSS vulnerability. User input is not properly sanitized.',
        risk: 'High',
        confidence: 'High',
        url: 'https://example.com/search',
        param: 'query',
        attack: '<script>alert("XSS")</script>',
        evidence: 'Reflected in search results',
        solution: 'Properly encode user input and use Content Security Policy headers.',
        reference: 'https://owasp.org/www-community/attacks/xss/',
        cweid: '79',
        wascid: '8'
      },
      {
        id: 'vuln-2',
        name: 'SQL Injection',
        description: 'The application may be vulnerable to SQL injection attacks.',
        risk: 'Critical',
        confidence: 'Medium',
        url: 'https://example.com/api/users',
        param: 'id',
        attack: "1' OR '1'='1",
        evidence: 'Error message reveals database structure',
        solution: 'Use parameterized queries and input validation.',
        reference: 'https://owasp.org/www-community/attacks/SQL_Injection',
        cweid: '89',
        wascid: '19'
      },
      {
        id: 'vuln-3',
        name: 'Missing Security Headers',
        description: 'The response does not include security headers like X-Frame-Options, X-Content-Type-Options.',
        risk: 'Medium',
        confidence: 'High',
        url: 'https://example.com/',
        solution: 'Implement proper security headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection.',
        reference: 'https://owasp.org/www-project-secure-headers/',
        cweid: '693'
      },
      {
        id: 'vuln-4',
        name: 'Insecure Direct Object Reference',
        description: 'User can access resources by manipulating URL parameters.',
        risk: 'High',
        confidence: 'Medium',
        url: 'https://example.com/profile/123',
        param: 'userId',
        solution: 'Implement proper access controls and authorization checks.',
        reference: 'https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control',
        cweid: '639'
      }
    ];

    // Randomly include some vulnerabilities
    return mockVulns.filter(() => Math.random() > 0.3);
  }

  // Calculate vulnerability summary
  private calculateSummary(vulnerabilities: Vulnerability[]) {
    const summary = { total: vulnerabilities.length, critical: 0, high: 0, medium: 0, low: 0 };
    
    vulnerabilities.forEach(vuln => {
      switch (vuln.risk) {
        case 'Critical': summary.critical++; break;
        case 'High': summary.high++; break;
        case 'Medium': summary.medium++; break;
        case 'Low': summary.low++; break;
      }
    });

    return summary;
  }

  // Get scan result by ID
  getScan(scanId: string): ScanResult | null {
    return this.scans.get(scanId) || null;
  }

  // Get all scans
  getScans(): ScanResult[] {
    return Array.from(this.scans.values()).sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  // Get security metrics
  getSecurityMetrics(): SecurityMetrics {
    const scans = this.getScans();
    const completedScans = scans.filter(s => s.status === 'completed');
    const totalVulns = completedScans.reduce((sum, scan) => sum + scan.summary.total, 0);
    const criticalVulns = completedScans.reduce((sum, scan) => sum + scan.summary.critical, 0);

    // Calculate security score (0-100, higher is better)
    let securityScore = 100;
    if (totalVulns > 0) {
      securityScore = Math.max(0, 100 - (criticalVulns * 20 + totalVulns * 5));
    }

    return {
      totalScans: scans.length,
      activeScans: scans.filter(s => s.status === 'running').length,
      totalVulnerabilities: totalVulns,
      criticalVulnerabilities: criticalVulns,
      securityScore: Math.round(securityScore),
      riskTrend: this.calculateRiskTrend(completedScans),
      lastScanDate: completedScans[0]?.endTime || 'Never'
    };
  }

  // Calculate risk trend
  private calculateRiskTrend(scans: ScanResult[]): 'increasing' | 'decreasing' | 'stable' {
    if (scans.length < 2) return 'stable';

    const recent = scans.slice(0, 3);
    const older = scans.slice(3, 6);

    const recentAvg = recent.reduce((sum, s) => sum + s.summary.total, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, s) => sum + s.summary.total, 0) / older.length : recentAvg;

    if (recentAvg > olderAvg * 1.1) return 'increasing';
    if (recentAvg < olderAvg * 0.9) return 'decreasing';
    return 'stable';
  }

  // Stop a running scan
  async stopScan(scanId: string): Promise<boolean> {
    const scan = this.scans.get(scanId);
    if (!scan || scan.status !== 'running') return false;

    if (this.isConnected) {
      try {
        await this.makeZAPRequest('/JSON/spider/action/stop/');
        await this.makeZAPRequest('/JSON/ascan/action/stop/');
      } catch (error) {
        console.error('Error stopping ZAP scan:', error);
      }
    }

    scan.status = 'completed';
    scan.endTime = new Date().toISOString();
    this.scans.set(scanId, scan);

    return true;
  }

  // Delete scan
  deleteScan(scanId: string): boolean {
    return this.scans.delete(scanId);
  }

  // Generate security report
  generateReport(scanId: string): any {
    const scan = this.scans.get(scanId);
    if (!scan) return null;

    return {
      scan,
      generatedAt: new Date().toISOString(),
      executiveSummary: this.generateExecutiveSummary(scan),
      recommendations: this.generateRecommendations(scan.vulnerabilities),
      technicalDetails: scan.vulnerabilities
    };
  }

  // Generate executive summary
  private generateExecutiveSummary(scan: ScanResult): string {
    const { summary } = scan;
    
    if (summary.total === 0) {
      return 'No security vulnerabilities were identified during this scan. The application appears to follow security best practices.';
    }

    let summary_text = `Security scan identified ${summary.total} potential vulnerabilities. `;
    
    if (summary.critical > 0) {
      summary_text += `${summary.critical} critical issues require immediate attention. `;
    }
    
    if (summary.high > 0) {
      summary_text += `${summary.high} high-risk vulnerabilities should be addressed promptly. `;
    }

    summary_text += 'Detailed findings and remediation steps are provided in the technical details section.';
    
    return summary_text;
  }

  // Generate recommendations
  private generateRecommendations(vulnerabilities: Vulnerability[]): string[] {
    const recommendations = new Set<string>();

    vulnerabilities.forEach(vuln => {
      if (vuln.name.toLowerCase().includes('xss')) {
        recommendations.add('Implement Content Security Policy (CSP) headers');
        recommendations.add('Properly encode user input in all contexts');
      }
      
      if (vuln.name.toLowerCase().includes('sql')) {
        recommendations.add('Use parameterized queries for database operations');
        recommendations.add('Implement input validation and sanitization');
      }
      
      if (vuln.name.toLowerCase().includes('header')) {
        recommendations.add('Configure security headers (X-Frame-Options, X-Content-Type-Options, etc.)');
      }
      
      if (vuln.name.toLowerCase().includes('access')) {
        recommendations.add('Implement proper access controls and authorization');
        recommendations.add('Use principle of least privilege');
      }
    });

    recommendations.add('Regular security assessments and penetration testing');
    recommendations.add('Security awareness training for development team');

    return Array.from(recommendations);
  }

  // Initialize mock data for demo
  private initializeMockData(): void {
    // Add a completed mock scan
    const mockScan: ScanResult = {
      id: 'demo-scan-1',
      target: 'https://your-app.com',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      vulnerabilities: this.generateMockVulnerabilities(),
      summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
    };

    mockScan.summary = this.calculateSummary(mockScan.vulnerabilities);
    this.scans.set(mockScan.id, mockScan);
  }

  // Check if connected to ZAP
  isZAPConnected(): boolean {
    return this.isConnected;
  }

  // Get ZAP configuration
  getConfig(): ZAPConfig {
    return { ...this.config };
  }

  // Update ZAP configuration
  updateConfig(config: Partial<ZAPConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const securityService = new SecurityService();
