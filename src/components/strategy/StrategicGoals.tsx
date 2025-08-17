import React from 'react';
import { Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const StrategicGoals = () => {
  const goals = [
    {
      title: 'Brand Awareness',
      target: '50K impressions',
      current: '38K',
      progress: 76,
      deadline: 'End of Q1',
      status: 'on-track',
    },
    {
      title: 'Lead Generation',
      target: '200 MQLs',
      current: '156',
      progress: 78,
      deadline: 'End of Q1',
      status: 'on-track',
    },
    {
      title: 'Thought Leadership',
      target: '10 speaking events',
      current: '7',
      progress: 70,
      deadline: 'End of Q2',
      status: 'at-risk',
    },
    {
      title: 'Community Growth',
      target: '5K followers',
      current: '4.2K',
      progress: 84,
      deadline: 'End of Q1',
      status: 'ahead',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead':
        return <TrendingUp className="w-4 h-4 text-soft-emerald" />;
      case 'on-track':
        return <CheckCircle className="w-4 h-4 text-sage" />;
      case 'at-risk':
        return <Target className="w-4 h-4 text-warm-amber" />;
      default:
        return <Target className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead':
        return 'text-soft-emerald';
      case 'on-track':
        return 'text-sage';
      case 'at-risk':
        return 'text-warm-amber';
      default:
        return 'text-neutral-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'ahead':
        return 'bg-soft-emerald';
      case 'on-track':
        return 'bg-sage';
      case 'at-risk':
        return 'bg-warm-amber';
      default:
        return 'bg-neutral-400';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Strategic Goals</h2>
        <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
          Edit Goals
        </button>
      </div>

      <div className="space-y-5">
        {goals.map((goal, index) => (
          <div
            key={index}
            className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-neutral-900">{goal.title}</h3>
              <div className="flex items-center space-x-1">
                {getStatusIcon(goal.status)}
                <span className={`text-xs font-medium capitalize ${getStatusColor(goal.status)}`}>
                  {goal.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
              <span>{goal.current} / {goal.target}</span>
              <span>{goal.progress}%</span>
            </div>

            <div className="w-full bg-neutral-100 rounded-full h-2 mb-3">
              <div
                className={`h-2 ${getProgressColor(goal.status)} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            <div className="flex items-center text-xs text-neutral-500">
              <Calendar className="w-3 h-3 mr-1" />
              Due {goal.deadline}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-900 mb-1">77%</div>
          <div className="text-sm text-neutral-600">Overall Goal Progress</div>
          <div className="w-full bg-neutral-100 rounded-full h-2 mt-3">
            <div className="h-2 bg-sage rounded-full transition-all duration-500 ease-out" style={{ width: '77%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicGoals;