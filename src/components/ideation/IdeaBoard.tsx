import React from 'react';
import { MoreHorizontal, Star, Clock, Tag } from 'lucide-react';

const IdeaBoard = () => {
  const ideas = [
    {
      id: 1,
      title: 'The Future of Remote Work',
      description: 'Exploring how distributed teams are reshaping the workplace and what it means for company culture.',
      tags: ['Remote Work', 'Future of Work', 'Culture'],
      priority: 'high',
      stage: 'research',
      pillar: 'Thought Leadership',
      createdAt: '2 days ago',
    },
    {
      id: 2,
      title: 'Customer Success Story: TechCorp',
      description: 'How TechCorp increased productivity by 40% using our platform. Include metrics and testimonials.',
      tags: ['Case Study', 'Customer Success', 'ROI'],
      priority: 'medium',
      stage: 'outline',
      pillar: 'Product Education',
      createdAt: '1 week ago',
    },
    {
      id: 3,
      title: 'AI in Content Marketing',
      description: 'Comprehensive guide on using AI tools for content creation, optimization, and distribution.',
      tags: ['AI', 'Content Marketing', 'Tools'],
      priority: 'high',
      stage: 'draft',
      pillar: 'Industry Insights',
      createdAt: '3 days ago',
    },
    {
      id: 4,
      title: 'Building Community Around Your Brand',
      description: 'Strategies for fostering genuine connections and engagement with your audience.',
      tags: ['Community', 'Engagement', 'Brand'],
      priority: 'low',
      stage: 'idea',
      pillar: 'Community Building',
      createdAt: '5 days ago',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea':
        return 'bg-neutral-100 text-neutral-600';
      case 'research':
        return 'bg-blue-100 text-blue-600';
      case 'outline':
        return 'bg-purple-100 text-purple-600';
      case 'draft':
        return 'bg-sage/10 text-sage';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Idea Board</h2>
        <div className="flex items-center space-x-2">
          <button className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200">
            <Star className="w-4 h-4" />
          </button>
          <button className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200 hover:shadow-soft group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-sage transition-colors duration-200">
                  {idea.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                  {idea.description}
                </p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-neutral-100 rounded-lg">
                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(idea.priority)}`}>
                  {idea.priority}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStageColor(idea.stage)}`}>
                  {idea.stage}
                </span>
              </div>
              <div className="flex items-center text-xs text-neutral-500">
                <Clock className="w-3 h-3 mr-1" />
                {idea.createdAt}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
              <div className="flex flex-wrap gap-1">
                {idea.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-lg bg-neutral-100 text-neutral-600 text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {idea.tags.length > 3 && (
                  <span className="text-xs text-neutral-500">+{idea.tags.length - 3} more</span>
                )}
              </div>
              <span className="text-xs text-neutral-500 font-medium">{idea.pillar}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaBoard;