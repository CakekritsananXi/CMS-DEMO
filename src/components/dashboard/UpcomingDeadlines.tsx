import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

const UpcomingDeadlines = () => {
  const deadlines = [
    {
      title: 'LinkedIn Article: "AI in Marketing"',
      date: 'Today',
      time: '2:00 PM',
      status: 'urgent',
    },
    {
      title: 'Blog Post: Product Update',
      date: 'Tomorrow',
      time: '10:00 AM',
      status: 'upcoming',
    },
    {
      title: 'Newsletter: Weekly Insights',
      date: 'Friday',
      time: '9:00 AM',
      status: 'upcoming',
    },
    {
      title: 'Social Media Campaign',
      date: 'Next Monday',
      time: 'All day',
      status: 'planned',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-sage" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'upcoming':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-sage/5 border-sage/20';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Upcoming Deadlines</h2>
      
      <div className="space-y-3">
        {deadlines.map((deadline, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-soft ${getStatusBg(deadline.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-neutral-900 mb-1">{deadline.title}</h3>
                <p className="text-sm text-neutral-600">{deadline.date} at {deadline.time}</p>
              </div>
              {getStatusIcon(deadline.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;