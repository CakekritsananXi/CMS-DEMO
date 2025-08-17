import React from 'react';
import { Plus, FileText, Clock, Users, Target } from 'lucide-react';

const ContentBriefs = () => {
  const briefs = [
    {
      title: 'Q1 Product Launch Campaign',
      description: 'Comprehensive content strategy for new feature rollout',
      status: 'active',
      deadline: '2 weeks',
      assignedTo: ['Sarah', 'Mike'],
      pillar: 'Product Education',
      progress: 75,
    },
    {
      title: 'Thought Leadership Series',
      description: 'Industry insights and predictions for 2024',
      status: 'review',
      deadline: '1 week',
      assignedTo: ['Sarah'],
      pillar: 'Thought Leadership',
      progress: 90,
    },
    {
      title: 'Customer Success Stories',
      description: 'Case studies highlighting customer achievements',
      status: 'draft',
      deadline: '3 weeks',
      assignedTo: ['Emma', 'John'],
      pillar: 'Community Building',
      progress: 40,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-sage/10 text-sage border-sage/20';
      case 'review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'draft':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Content Briefs</h2>
        <button className="bg-sage text-white px-4 py-2 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 text-sm">
          <Plus className="w-4 h-4" />
          <span>New Brief</span>
        </button>
      </div>

      <div className="space-y-4">
        {briefs.map((brief, index) => (
          <div
            key={index}
            className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200 hover:shadow-soft"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-neutral-900">{brief.title}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(brief.status)}`}>
                    {brief.status}
                  </span>
                </div>
                <p className="text-neutral-600 text-sm mb-3">{brief.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Due in {brief.deadline}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{brief.assignedTo.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{brief.pillar}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-600">Progress</span>
                  <span className="font-medium text-neutral-900">{brief.progress}%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="h-2 bg-sage rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${brief.progress}%` }}
                  />
                </div>
              </div>
              <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentBriefs;