import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ChannelAnalytics = () => {
  const channels = [
    {
      name: 'LinkedIn',
      views: '18.2K',
      engagement: '6.8%',
      change: '+15.2%',
      trend: 'up',
      color: 'bg-warm-blue',
    },
    {
      name: 'Blog',
      views: '12.4K',
      engagement: '4.2%',
      change: '+8.7%',
      trend: 'up',
      color: 'bg-sage',
    },
    {
      name: 'Twitter',
      views: '9.1K',
      engagement: '3.8%',
      change: '-2.1%',
      trend: 'down',
      color: 'bg-warm-blue/80',
    },
    {
      name: 'Newsletter',
      views: '5.6K',
      engagement: '12.4%',
      change: '+22.3%',
      trend: 'up',
      color: 'bg-dusty-purple',
    },
    {
      name: 'YouTube',
      views: '3.2K',
      engagement: '8.9%',
      change: '+45.6%',
      trend: 'up',
      color: 'bg-muted-rose',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Channel Performance</h2>
        <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
          Detailed Report
        </button>
      </div>

      <div className="space-y-4">
        {channels.map((channel, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 ${channel.color} rounded-xl flex items-center justify-center`}>
                <span className="text-white font-medium text-sm">
                  {channel.name.substring(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900">{channel.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-neutral-500">
                  <span>{channel.views} views</span>
                  <span>{channel.engagement} engagement</span>
                </div>
              </div>
            </div>

            <div className={`flex items-center space-x-1 text-sm font-medium ${
              channel.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {channel.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{channel.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelAnalytics;