import React from 'react';
import { FileText, Lightbulb, Calendar, Users } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      type: 'content',
      icon: FileText,
      action: 'Created content brief',
      target: '"Product Launch Strategy"',
      time: '2 hours ago',
      color: 'text-sage',
    },
    {
      type: 'idea',
      icon: Lightbulb,
      action: 'Added new idea',
      target: '"Customer Success Stories"',
      time: '4 hours ago',
      color: 'text-warm-blue',
    },
    {
      type: 'schedule',
      icon: Calendar,
      action: 'Scheduled content',
      target: 'Instagram posts for next week',
      time: '6 hours ago',
      color: 'text-dusty-purple',
    },
    {
      type: 'team',
      icon: Users,
      action: 'Collaborated with',
      target: 'Design team on visual assets',
      time: '1 day ago',
      color: 'text-warm-amber',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-900">
                {activity.action} <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;