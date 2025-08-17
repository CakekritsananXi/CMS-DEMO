import React from 'react';
import { Hash, TrendingUp } from 'lucide-react';

const TopicClusters = () => {
  const clusters = [
    {
      name: 'AI & Automation',
      count: 12,
      trending: true,
      ideas: ['AI in Marketing', 'Automation Tools', 'ChatGPT for Business', 'Machine Learning Basics'],
    },
    {
      name: 'Remote Work',
      count: 8,
      trending: false,
      ideas: ['Remote Team Building', 'Digital Nomad Life', 'Virtual Meetings', 'Work-Life Balance'],
    },
    {
      name: 'Productivity',
      count: 15,
      trending: true,
      ideas: ['Time Management', 'Focus Techniques', 'Tool Reviews', 'Workflow Optimization'],
    },
    {
      name: 'Industry Trends',
      count: 6,
      trending: false,
      ideas: ['Market Analysis', 'Competitor Research', 'Future Predictions', 'Technology Adoption'],
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Topic Clusters</h2>
        <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
          Manage
        </button>
      </div>

      <div className="space-y-4">
        {clusters.map((cluster, index) => (
          <div
            key={index}
            className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200 hover:shadow-soft group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-neutral-500" />
                <h3 className="font-medium text-neutral-900">{cluster.name}</h3>
                {cluster.trending && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-medium">Trending</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-neutral-500 font-medium">{cluster.count} ideas</span>
            </div>

            <div className="space-y-2">
              {cluster.ideas.slice(0, 3).map((idea, ideaIndex) => (
                <div
                  key={ideaIndex}
                  className="text-sm text-neutral-600 p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors duration-200 cursor-pointer"
                >
                  {idea}
                </div>
              ))}
              {cluster.ideas.length > 3 && (
                <div className="text-xs text-neutral-500 text-center py-1">
                  +{cluster.ideas.length - 3} more ideas
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicClusters;