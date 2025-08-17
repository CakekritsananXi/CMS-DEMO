import React from 'react';
import { Target, TrendingUp, Users, Lightbulb } from 'lucide-react';

const ContentPillars = () => {
  const pillars = [
    {
      name: 'Thought Leadership',
      icon: Lightbulb,
      progress: 75,
      count: 12,
      color: 'bg-sage',
    },
    {
      name: 'Product Education',
      icon: Target,
      progress: 60,
      count: 8,
      color: 'bg-warm-blue',
    },
    {
      name: 'Industry Insights',
      icon: TrendingUp,
      progress: 90,
      count: 15,
      color: 'bg-dusty-purple',
    },
    {
      name: 'Community Building',
      icon: Users,
      progress: 45,
      count: 6,
      color: 'bg-warm-amber',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Content Pillars</h2>
        <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
          Manage
        </button>
      </div>

      <div className="space-y-4">
        {pillars.map((pillar, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${pillar.color} rounded-lg flex items-center justify-center`}>
                  <pillar.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-neutral-900">{pillar.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-neutral-500">{pillar.count} pieces</span>
                <span className="text-sm font-medium text-neutral-700">{pillar.progress}%</span>
              </div>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className={`h-2 ${pillar.color} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${pillar.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPillars;