import React from 'react';
import { Activity, TrendingUp, MessageCircle, Users } from 'lucide-react';

const ActivityFeed = () => {
  const feedItems = [
    {
      type: 'milestone',
      icon: TrendingUp,
      message: 'Team reached 90% of monthly content goal',
      time: '1 hour ago',
      color: 'text-soft-emerald',
    },
    {
      type: 'discussion',
      icon: MessageCircle,
      message: 'New discussion started in Q1 Campaign',
      time: '3 hours ago',
      color: 'text-warm-blue',
    },
    {
      type: 'team',
      icon: Users,
      message: 'Emma joined the Social Media project',
      time: '5 hours ago',
      color: 'text-dusty-purple',
    },
    {
      type: 'activity',
      icon: Activity,
      message: 'Content calendar updated with 5 new items',
      time: '8 hours ago',
      color: 'text-sage',
    },
    {
      type: 'milestone',
      icon: TrendingUp,
      message: 'Thought Leadership content hit 10K views',
      time: '1 day ago',
      color: 'text-soft-emerald',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Activity Feed</h2>
      
      <div className="space-y-4">
        {feedItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-900 mb-1">{item.message}</p>
              <p className="text-xs text-neutral-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;