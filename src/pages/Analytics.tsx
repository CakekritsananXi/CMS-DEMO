import React, { useState } from 'react';
import { TrendingUp, BarChart3, Calendar, Download } from 'lucide-react';
import MetricsOverview from '../components/analytics/MetricsOverview';
import ContentPerformance from '../components/analytics/ContentPerformance';
import ChannelAnalytics from '../components/analytics/ChannelAnalytics';
import PlanningInsights from '../components/analytics/PlanningInsights';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const handleExport = () => {
    console.log('Exporting analytics data for:', timeRange);
    // Implement export functionality
    alert('Analytics data exported successfully!');
  };
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Content Analytics</h1>
          <p className="text-neutral-600">Track performance and gain insights for better content planning</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleExport}
            className="px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview timeRange={timeRange} />

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <ContentPerformance />
          <ChannelAnalytics />
        </div>
        
        <div>
          <PlanningInsights />
        </div>
      </div>
    </div>
  );
};

export default Analytics;