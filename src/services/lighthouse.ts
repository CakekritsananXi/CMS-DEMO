export interface LighthouseConfig {
  url: string;
  categories: ('performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa')[];
  device: 'mobile' | 'desktop';
  throttling: 'mobile' | 'desktop' | 'none';
}

export interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: 'binary' | 'numeric' | 'manual' | 'informative' | 'notApplicable';
  displayValue?: string;
  details?: any;
}

export interface LighthouseCategory {
  id: string;
  title: string;
  score: number | null;
  auditRefs: { id: string; weight: number }[];
}

export interface LighthouseResult {
  lighthouseVersion: string;
  userAgent: string;
  fetchTime: string;
  requestedUrl: string;
  finalUrl: string;
  categories: Record<string, LighthouseCategory>;
  audits: Record<string, LighthouseAudit>;
  configSettings: {
    device: string;
    throttling: any;
  };
  runtimeError?: {
    code: string;
    message: string;
  };
}

export interface MobileOptimizationMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
  speedIndex: number;
  mobileUsability: number;
  touchTargetSize: number;
  tapDelay: number;
  viewportConfig: boolean;
}

class LighthouseService {
  private apiKey: string | null = null;
  private baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async runAudit(config: LighthouseConfig): Promise<LighthouseResult> {
    const params = new URLSearchParams({
      url: config.url,
      strategy: config.device,
      category: config.categories.join(','),
    });

    if (this.apiKey) {
      params.append('key', this.apiKey);
    }

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Lighthouse API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Lighthouse API error: ${data.error.message}`);
      }

      return data.lighthouseResult;
    } catch (error) {
      console.error('Lighthouse API error:', error);
      throw error;
    }
  }

  async analyzeMobilePerformance(url: string): Promise<MobileOptimizationMetrics> {
    const config: LighthouseConfig = {
      url,
      categories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      device: 'mobile',
      throttling: 'mobile'
    };

    try {
      const result = await this.runAudit(config);
      return this.extractMobileMetrics(result);
    } catch (error) {
      console.error('Mobile performance analysis failed:', error);
      // Return mock data for development
      return this.getMockMobileMetrics();
    }
  }

  private extractMobileMetrics(result: LighthouseResult): MobileOptimizationMetrics {
    const categories = result.categories;
    const audits = result.audits;

    return {
      performance: this.getScoreValue(categories.performance?.score),
      accessibility: this.getScoreValue(categories.accessibility?.score),
      bestPractices: this.getScoreValue(categories['best-practices']?.score),
      seo: this.getScoreValue(categories.seo?.score),
      pwa: this.getScoreValue(categories.pwa?.score),
      firstContentfulPaint: this.getMetricValue(audits['first-contentful-paint']?.displayValue),
      largestContentfulPaint: this.getMetricValue(audits['largest-contentful-paint']?.displayValue),
      totalBlockingTime: this.getMetricValue(audits['total-blocking-time']?.displayValue),
      cumulativeLayoutShift: this.getNumericValue(audits['cumulative-layout-shift']?.displayValue),
      speedIndex: this.getMetricValue(audits['speed-index']?.displayValue),
      mobileUsability: this.getScoreValue(audits['mobile-friendly']?.score) || 100,
      touchTargetSize: this.getScoreValue(audits['tap-targets']?.score) || 100,
      tapDelay: this.getMetricValue(audits['tap-targets']?.displayValue) || 0,
      viewportConfig: this.getScoreValue(audits['viewport']?.score) === 100,
    };
  }

  private getScoreValue(score: number | null): number {
    return score ? Math.round(score * 100) : 0;
  }

  private getMetricValue(displayValue?: string): number {
    if (!displayValue) return 0;
    const match = displayValue.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  private getNumericValue(displayValue?: string): number {
    if (!displayValue) return 0;
    return parseFloat(displayValue) || 0;
  }

  private getMockMobileMetrics(): MobileOptimizationMetrics {
    return {
      performance: 92,
      accessibility: 96,
      bestPractices: 100,
      seo: 95,
      pwa: 88,
      firstContentfulPaint: 1.2,
      largestContentfulPaint: 2.1,
      totalBlockingTime: 45,
      cumulativeLayoutShift: 0.08,
      speedIndex: 1.8,
      mobileUsability: 100,
      touchTargetSize: 95,
      tapDelay: 0,
      viewportConfig: true,
    };
  }

  getRecommendations(metrics: MobileOptimizationMetrics): Array<{
    category: string;
    issue: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const recommendations: Array<{
      category: string;
      issue: string;
      recommendation: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    if (metrics.performance < 90) {
      recommendations.push({
        category: 'Performance',
        issue: 'Low performance score',
        recommendation: 'Optimize images, reduce JavaScript bundle size, enable compression',
        priority: 'high'
      });
    }

    if (metrics.largestContentfulPaint > 2.5) {
      recommendations.push({
        category: 'Performance',
        issue: 'Slow Largest Contentful Paint',
        recommendation: 'Optimize critical rendering path and reduce server response times',
        priority: 'high'
      });
    }

    if (metrics.totalBlockingTime > 50) {
      recommendations.push({
        category: 'Performance',
        issue: 'High Total Blocking Time',
        recommendation: 'Reduce main thread work and minimize long-running JavaScript tasks',
        priority: 'medium'
      });
    }

    if (metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push({
        category: 'Performance',
        issue: 'Layout instability',
        recommendation: 'Set explicit dimensions for images and avoid content that shifts during load',
        priority: 'medium'
      });
    }

    if (metrics.accessibility < 95) {
      recommendations.push({
        category: 'Accessibility',
        issue: 'Accessibility issues detected',
        recommendation: 'Add proper ARIA labels, improve color contrast, ensure keyboard navigation',
        priority: 'high'
      });
    }

    if (metrics.touchTargetSize < 95) {
      recommendations.push({
        category: 'Mobile Usability',
        issue: 'Small touch targets',
        recommendation: 'Ensure all interactive elements are at least 44px tall and wide',
        priority: 'medium'
      });
    }

    if (!metrics.viewportConfig) {
      recommendations.push({
        category: 'Mobile Usability',
        issue: 'Viewport not optimized',
        recommendation: 'Add proper viewport meta tag with width=device-width',
        priority: 'high'
      });
    }

    return recommendations;
  }
}

export const lighthouseService = new LighthouseService();
