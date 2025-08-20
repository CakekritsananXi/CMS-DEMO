import React, { useState } from 'react';
import { FileText, Download, Share2, Printer, Calendar, Shield, AlertTriangle, CheckCircle, TrendingUp, ExternalLink } from 'lucide-react';
import { ScanResult, securityService } from '../../services/security';
import VulnerabilityCard from './VulnerabilityCard';

interface SecurityReportProps {
  scan: ScanResult;
  onClose?: () => void;
}

interface ReportSection {
  id: string;
  title: string;
  included: boolean;
}

const SecurityReport: React.FC<SecurityReportProps> = ({ scan, onClose }) => {
  const [reportType, setReportType] = useState<'executive' | 'technical' | 'compliance'>('executive');
  const [includedSections, setIncludedSections] = useState<ReportSection[]>([
    { id: 'summary', title: 'Executive Summary', included: true },
    { id: 'methodology', title: 'Testing Methodology', included: true },
    { id: 'findings', title: 'Security Findings', included: true },
    { id: 'vulnerabilities', title: 'Detailed Vulnerabilities', included: true },
    { id: 'recommendations', title: 'Recommendations', included: true },
    { id: 'technical', title: 'Technical Details', included: false },
    { id: 'appendix', title: 'Appendix', included: false }
  ]);

  const report = securityService.generateReport(scan.id);

  const toggleSection = (sectionId: string) => {
    setIncludedSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, included: !section.included }
          : section
      )
    );
  };

  const generatePDF = () => {
    // In a real implementation, this would generate a PDF
    console.log('Generating PDF report...');
    alert('PDF generation would be implemented here using libraries like jsPDF or Puppeteer');
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `security-report-${scan.id}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: `Security Report - ${scan.target}`,
        text: report?.executiveSummary || 'Security scan report',
        url: window.location.href
      });
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard');
    }
  };

  if (!report) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Report Not Available</h3>
        <p className="text-neutral-600">Unable to generate report for this scan.</p>
      </div>
    );
  }

  const renderExecutiveSummary = () => (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-neutral-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Executive Summary</h3>
        <p className="text-neutral-700 leading-relaxed">{report.executiveSummary}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">{scan.summary.critical}</div>
          <div className="text-sm text-neutral-600">Critical Issues</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">{scan.summary.high}</div>
          <div className="text-sm text-neutral-600">High Risk</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-1">{scan.summary.medium}</div>
          <div className="text-sm text-neutral-600">Medium Risk</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">{scan.summary.low}</div>
          <div className="text-sm text-neutral-600">Low Risk</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Key Recommendations</h3>
        <div className="space-y-3">
          {report.recommendations.slice(0, 5).map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-sage/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-sage">{index + 1}</span>
              </div>
              <p className="text-neutral-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTechnicalReport = () => (
    <div className="space-y-6">
      {/* Scan Information */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Scan Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Target Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Target URL:</span>
                <span className="font-mono text-neutral-900">{scan.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Scan ID:</span>
                <span className="font-mono text-neutral-900">{scan.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Scan Type:</span>
                <span className="text-neutral-900">Security Assessment</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Timing Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Start Time:</span>
                <span className="text-neutral-900">{new Date(scan.startTime).toLocaleString()}</span>
              </div>
              {scan.endTime && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">End Time:</span>
                  <span className="text-neutral-900">{new Date(scan.endTime).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Duration:</span>
                <span className="text-neutral-900">
                  {scan.endTime
                    ? Math.round((new Date(scan.endTime).getTime() - new Date(scan.startTime).getTime()) / 60000)
                    : 'N/A'} minutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerabilities */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Detailed Findings</h3>
        <div className="space-y-4">
          {scan.vulnerabilities.map((vulnerability) => (
            <VulnerabilityCard key={vulnerability.id} vulnerability={vulnerability} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderComplianceReport = () => (
    <div className="space-y-6">
      {/* OWASP Top 10 Mapping */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">OWASP Top 10 Compliance</h3>
        <div className="space-y-4">
          {[
            { id: 'A01', name: 'Broken Access Control', status: 'pass', issues: 0 },
            { id: 'A02', name: 'Cryptographic Failures', status: 'warning', issues: 1 },
            { id: 'A03', name: 'Injection', status: 'fail', issues: 2 },
            { id: 'A04', name: 'Insecure Design', status: 'pass', issues: 0 },
            { id: 'A05', name: 'Security Misconfiguration', status: 'warning', issues: 1 },
            { id: 'A06', name: 'Vulnerable Components', status: 'pass', issues: 0 },
            { id: 'A07', name: 'Identification Failures', status: 'pass', issues: 0 },
            { id: 'A08', name: 'Software Integrity Failures', status: 'pass', issues: 0 },
            { id: 'A09', name: 'Logging Failures', status: 'warning', issues: 1 },
            { id: 'A10', name: 'Server-Side Request Forgery', status: 'pass', issues: 0 }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  item.status === 'pass' ? 'bg-green-100 text-green-600' :
                  item.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {item.id}
                </div>
                <span className="font-medium text-neutral-900">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600">{item.issues} issues</span>
                <div className={`w-3 h-3 rounded-full ${
                  item.status === 'pass' ? 'bg-green-500' :
                  item.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Score */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Compliance Score</h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-sage mb-2">85%</div>
          <p className="text-neutral-600">Overall security compliance score</p>
          <div className="mt-4 bg-neutral-200 rounded-full h-3">
            <div className="bg-sage h-3 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-soft max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Security Report</h2>
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>{scan.target}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-neutral-100 rounded-xl p-1">
              {[
                { id: 'executive', label: 'Executive' },
                { id: 'technical', label: 'Technical' },
                { id: 'compliance', label: 'Compliance' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    reportType === type.id
                      ? 'bg-white shadow-soft text-sage'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={generatePDF}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                title="Download PDF"
              >
                <Download className="w-4 h-4 text-neutral-600" />
              </button>
              <button
                onClick={exportJSON}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                title="Export JSON"
              >
                <FileText className="w-4 h-4 text-neutral-600" />
              </button>
              <button
                onClick={shareReport}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                title="Share Report"
              >
                <Share2 className="w-4 h-4 text-neutral-600" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                  title="Close Report"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6">
        {reportType === 'executive' && renderExecutiveSummary()}
        {reportType === 'technical' && renderTechnicalReport()}
        {reportType === 'compliance' && renderComplianceReport()}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-neutral-100 bg-neutral-50">
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <div>
            Generated by ContentFlow Security Center • {new Date(report.generatedAt).toLocaleString()}
          </div>
          <div className="flex items-center space-x-1">
            <span>Powered by</span>
            <a 
              href="https://www.zaproxy.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sage hover:text-sage/80 font-medium flex items-center space-x-1"
            >
              <span>OWASP ZAP</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReport;
