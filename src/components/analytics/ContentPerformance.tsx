import React from 'react';
import { TrendingUp, Eye, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';

const ContentPerformance = () => {
  const topContent = [
    {
      title: 'The Future of AI in Marketing',
      type: 'Blog Post',
      views: '12.4K',
      engagement: '8.2%',
      likes: '1.2K',
      comments: '234',
      pillar: 'Thought Leadership',
      publishDate: '2024-01-10',
      trend: 'up',
    },
    {
      title: 'Product Update: New Dashboard Features',
      type: 'LinkedIn Article',
      views: '8.7K',
      engagement: '6.8%',
      likes: '890',
      comments: '156',
      pillar: 'Product Education',
      publishDate: '2024-01-12',
      trend: 'up',
    },
    {
      title: 'Customer Success: How TechCorp Scaled',
      type: 'Case Study',
      views: '6.3K',
      engagement: '5.4%',
      likes: '672',
      comments: '89',
      pillar: 'Community Building',
      publishDate: '2024-01-08',
      trend: 'down',
    },
    {
      title: '2024 Industry Report: Market Trends',
      type: 'Research Report',
      views: '15.2K',
      engagement: '9.1%',
      likes: '1.8K',
      comments: '298',
      pillar: 'Industry Insights',
      publishDate: '2024-01-05',
      trend: 'up',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Top Performing Content</h2>
        <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {topContent.map((content, index) => (
          <div
            key={index}
            className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200 hover:shadow-soft"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-neutral-900">{content.title}</h3>
                  <div className={`flex items-center space-x-1 ${
                    content.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${content.trend === 'down' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-500">
                  <span>{content.type}</span>
                  <span>•</span>
                  <span>{content.publishDate}</span>
                  <span>•</span>
                  <span className="text-sage font-medium">{content.pillar}</span>
                </div>
              </div>
              <button className="p-1 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-neutral-500 mb-1">
                  <Eye className="w-3 h-3" />
                  <span className="text-xs">Views</span>
                </div>
                <div className="font-semibold text-neutral-900">{content.views}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-neutral-500 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">Engagement</span>
                </div>
                <div className="font-semibold text-neutral-900">{content.engagement}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-neutral-500 mb-1">
                  <Heart className="w-3 h-3" />
                  <span className="text-xs">Likes</span>
                </div>
                <div className="font-semibold text-neutral-900">{content.likes}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-neutral-500 mb-1">
                  <MessageCircle className="w-3 h-3" />
                  <span className="text-xs">Comments</span>
                </div>
                <div className="font-semibold text-neutral-900">{content.comments}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPerformance;