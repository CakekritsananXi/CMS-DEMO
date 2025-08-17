import React from 'react';
import { Users, Calendar, MoreHorizontal, Clock } from 'lucide-react';

const SharedProjects = () => {
  const projects = [
    {
      title: 'Q1 Product Launch Campaign',
      description: 'Comprehensive content strategy for new feature rollout',
      members: [
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
        'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      ],
      progress: 75,
      deadline: '2 weeks left',
      status: 'active',
    },
    {
      title: 'Thought Leadership Series',
      description: 'Industry insights and predictions for 2024',
      members: [
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      ],
      progress: 90,
      deadline: '1 week left',
      status: 'review',
    },
    {
      title: 'Social Media Rebranding',
      description: 'Visual identity update across all social platforms',
      members: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      ],
      progress: 45,
      deadline: '3 weeks left',
      status: 'planning',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-sage/10 text-sage border-sage/20';
      case 'review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'planning':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Shared Projects</h2>
        <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="p-5 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200 hover:shadow-soft"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-neutral-900">{project.title}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-neutral-600 text-sm">{project.description}</p>
              </div>
              <button className="p-1 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-neutral-500" />
                  <div className="flex -space-x-2">
                    {project.members.map((avatar, avatarIndex) => (
                      <img
                        key={avatarIndex}
                        src={avatar}
                        alt=""
                        className="w-6 h-6 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-neutral-500">
                  <Clock className="w-4 h-4" />
                  <span>{project.deadline}</span>
                </div>
              </div>

              <div className="text-sm font-medium text-neutral-900">
                {project.progress}% complete
              </div>
            </div>

            <div className="w-full bg-neutral-100 rounded-full h-2">
              <div
                className="h-2 bg-sage rounded-full transition-all duration-500 ease-out"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedProjects;