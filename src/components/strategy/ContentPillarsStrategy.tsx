import React from 'react';
import { Target, TrendingUp, Users, Lightbulb, MoreHorizontal } from 'lucide-react';

const ContentPillarsStrategy = () => {
  const pillars = [
    {
      name: 'Thought Leadership',
      icon: Lightbulb,
      description: 'Industry insights, predictions, and expert opinions to establish authority',
      targetPercentage: 30,
      currentPercentage: 32,
      contentTypes: ['Blog Posts', 'LinkedIn Articles', 'Webinars'],
      kpis: ['Brand Awareness', 'Expert Recognition', 'Speaking Opportunities'],
      color: 'bg-sage',
    },
    {
      name: 'Product Education',
      icon: Target,
      description: 'Educational content about features, benefits, and use cases',
      targetPercentage: 40,
      currentPercentage: 35,
      contentTypes: ['Tutorials', 'Feature Demos', 'Use Cases'],
      kpis: ['Product Adoption', 'Feature Usage', 'Customer Education'],
      color: 'bg-warm-blue',
    },
    {
      name: 'Industry Insights',
      icon: TrendingUp,
      description: 'Market trends, research findings, and data-driven analysis',
      targetPercentage: 20,
      currentPercentage: 23,
      contentTypes: ['Research Reports', 'Trend Analysis', 'Data Stories'],
      kpis: ['Thought Leadership', 'Media Mentions', 'Content Shares'],
      color: 'bg-dusty-purple',
    },
    {
      name: 'Community Building',
      icon: Users,
      description: 'Content that fosters connection and engagement with audience',
      targetPercentage: 10,
      currentPercentage: 10,
      contentTypes: ['Community Stories', 'Behind-the-Scenes', 'User-Generated Content'],
      kpis: ['Community Growth', 'Engagement Rate', 'User Participation'],
      color: 'bg-warm-amber',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Content Pillar Strategy</h2>
        <button className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200">
          Edit Strategy
        </button>
      </div>

      <div className="space-y-6">
        {pillars.map((pillar, index) => (
          <div
            key={index}
            className="p-5 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${pillar.color} rounded-xl flex items-center justify-center`}>
                  <pillar.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{pillar.name}</h3>
                  <p className="text-sm text-neutral-600 mt-1">{pillar.description}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-neutral-600 mb-2">Content Distribution</div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Target: {pillar.targetPercentage}%</span>
                      <span>Current: {pillar.currentPercentage}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2">
                      <div
                        className={`h-2 ${pillar.color} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${(pillar.currentPercentage / pillar.targetPercentage) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-neutral-600 mb-2">Content Types</div>
                <div className="flex flex-wrap gap-1">
                  {pillar.contentTypes.map((type, typeIndex) => (
                    <span
                      key={typeIndex}
                      className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-600 mb-2">Key Performance Indicators</div>
              <div className="flex flex-wrap gap-1">
                {pillar.kpis.map((kpi, kpiIndex) => (
                  <span
                    key={kpiIndex}
                    className="px-2 py-1 bg-sage/5 text-sage border border-sage/20 rounded-lg text-xs font-medium"
                  >
                    {kpi}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPillarsStrategy;