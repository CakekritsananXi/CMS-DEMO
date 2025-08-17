import React from 'react';
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share } from 'lucide-react';

interface MetricsOverviewProps {
  timeRange: string;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ timeRange }) => {
  const metrics = [
    {
      label: 'Total Views',
      value: '24.8K',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-warm-blue',
    },
    {
      label: 'Engagement Rate',
      value: '4.2%',
      change: '+0.8%',
      trend: 'up',
      icon: Heart,
      color: 'text-muted-rose',
    },
    {
      label: 'Comments',
      value: '1.2K',
      change: '-2.1%',
      trend: 'down',
      icon: MessageCircle,
      color: 'text-soft-emerald',
    },
    {
      label: 'Shares',
      value: '892',
      change: '+18.3%',
      trend: 'up',
      icon: Share,
      color: 'text-dusty-purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              metric.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{metric.change}</span>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-neutral-900 mb-1">{metric.value}</div>
          <div className="text-sm text-neutral-600">{metric.label}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;