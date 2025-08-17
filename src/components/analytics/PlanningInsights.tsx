import React from 'react';
import { Lightbulb, TrendingUp, Target, Calendar } from 'lucide-react';

const PlanningInsights = () => {
  const insights = [
    {
      type: 'recommendation',
      icon: Lightbulb,
      title: 'Optimize Posting Time',
      description: 'Your LinkedIn posts perform 23% better when published at 2 PM EST.',
      action: 'Schedule content',
      color: 'text-warm-amber',
      bgColor: 'bg-warm-amber/10',
    },
    {
      type: 'trend',
      icon: TrendingUp,
      title: 'AI Content Trending',
      description: 'AI-related content has 45% higher engagement. Consider more AI topics.',
      action: 'Create AI content',
      color: 'text-soft-emerald',
      bgColor: 'bg-soft-emerald/10',
    },
    {
      type: 'goal',
      icon: Target,
      title: 'Goal Progress',
      description: 'You\'re 89% towards your monthly content goal. 3 more pieces needed.',
      action: 'Plan content',
      color: 'text-sage',
      bgColor: 'bg-sage/5',
    },
    {
      type: 'planning',
      icon: Calendar,
      title: 'Content Gap',
      description: 'No content scheduled for next Tuesday. Consider filling this slot.',
      action: 'Schedule content',
      color: 'text-warm-blue',
      bgColor: 'bg-warm-blue/10',
    },
  ];

  const bestPerformingTopics = [
    { topic: 'AI & Machine Learning', score: 94 },
    { topic: 'Remote Work', score: 87 },
    { topic: 'Product Updates', score: 82 },
    { topic: 'Customer Stories', score: 78 },
    { topic: 'Industry Trends', score: 73 },
  ];

  return (
    <div className="space-y-6">
      {/* Planning Insights */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">Planning Insights</h2>
        
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${insight.bgColor} border-${insight.color.replace('text-', '')}/20`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${insight.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <insight.icon className={`w-4 h-4 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-900 mb-1">{insight.title}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{insight.description}</p>
                  <button className={`text-sm font-medium ${insight.color} hover:opacity-80 transition-opacity duration-200`}>
                    {insight.action} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Performing Topics */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">Best Performing Topics</h2>
        
        <div className="space-y-3">
          {bestPerformingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-900">{topic.topic}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-neutral-100 rounded-full h-2">
                  <div
                    className="h-2 bg-sage rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${topic.score}%` }}
                  />
                </div>
                <span className="text-sm text-neutral-500 font-medium">{topic.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanningInsights;