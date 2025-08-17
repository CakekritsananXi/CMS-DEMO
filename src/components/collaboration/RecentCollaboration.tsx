import React from 'react';
import { MessageCircle, FileText, Eye, Edit, Clock } from 'lucide-react';

const RecentCollaboration = () => {
  const activities = [
    {
      type: 'comment',
      user: 'Mike Johnson',
      action: 'commented on',
      target: '"AI in Marketing" blog post',
      content: 'Great insights on the automation section. Should we add more examples?',
      time: '2 hours ago',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      type: 'edit',
      user: 'Emma Davis',
      action: 'updated visuals for',
      target: 'Product Launch Campaign',
      content: 'Added new hero images and updated brand colors across all materials.',
      time: '4 hours ago',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      type: 'review',
      user: 'John Wilson',
      action: 'requested review for',
      target: 'Customer Success Video',
      content: 'Video editing complete. Ready for final approval before publishing.',
      time: '6 hours ago',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      type: 'create',
      user: 'Lisa Park',
      action: 'created new content brief',
      target: 'Social Media Q2 Strategy',
      content: 'Outlined strategy for Instagram and LinkedIn growth initiatives.',
      time: '1 day ago',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'edit':
        return <Edit className="w-4 h-4 text-emerald-500" />;
      case 'review':
        return <Eye className="w-4 h-4 text-purple-500" />;
      case 'create':
        return <FileText className="w-4 h-4 text-sage" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Recent Collaboration</h2>
        <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
          View All Activity
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-4 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
          >
            <img
              src={activity.avatar}
              alt={activity.user}
              className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {getActivityIcon(activity.type)}
                <span className="text-sm text-neutral-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </span>
              </div>
              
              <p className="text-sm text-neutral-600 mb-2">{activity.content}</p>
              
              <div className="flex items-center text-xs text-neutral-500">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCollaboration;