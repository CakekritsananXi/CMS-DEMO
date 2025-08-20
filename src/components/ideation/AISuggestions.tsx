import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, TrendingUp, Lightbulb, Target, Users, Zap, ChevronRight, X } from 'lucide-react';

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  reasoning: string;
  confidence: number;
  trend: 'rising' | 'stable' | 'declining';
  targetAudience: string;
  estimatedEngagement: number;
  keywordScore: number;
}

interface AISuggestionsProps {
  onSuggestionSelect?: (suggestion: AISuggestion) => void;
  className?: string;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ onSuggestionSelect, className = '' }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Mock AI suggestions (in production, this would call an AI API)
  const generateSuggestions = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSuggestions: AISuggestion[] = [
      {
        id: '1',
        title: 'Interactive AI Tools for Content Creation',
        description: 'Explore how AI-powered tools are revolutionizing content creation workflows, from ideation to publication.',
        category: 'Technology',
        reasoning: 'High search volume for AI content tools (+150% this month). Strong engagement in tech communities.',
        confidence: 0.92,
        trend: 'rising',
        targetAudience: 'Content creators, marketers, tech enthusiasts',
        estimatedEngagement: 85,
        keywordScore: 94
      },
      {
        id: '2',
        title: 'Sustainable Marketing Strategies for 2024',
        description: 'A comprehensive guide to eco-friendly marketing approaches that resonate with conscious consumers.',
        category: 'Marketing',
        reasoning: 'Sustainability trends growing 45% YoY. High conversion potential among millennials/Gen Z.',
        confidence: 0.87,
        trend: 'rising',
        targetAudience: 'Sustainable brands, eco-conscious marketers',
        estimatedEngagement: 78,
        keywordScore: 82
      },
      {
        id: '3',
        title: 'Remote Work Productivity Hacks',
        description: 'Evidence-based strategies to maximize productivity and maintain work-life balance in remote settings.',
        category: 'Productivity',
        reasoning: 'Remote work searches remain stable. Proven evergreen content with consistent engagement.',
        confidence: 0.81,
        trend: 'stable',
        targetAudience: 'Remote workers, HR professionals, team leaders',
        estimatedEngagement: 72,
        keywordScore: 76
      },
      {
        id: '4',
        title: 'Building Community-Driven Brands',
        description: 'How successful companies are leveraging community building as a core growth strategy.',
        category: 'Business Strategy',
        reasoning: 'Community building keywords trending upward. High shareability and discussion potential.',
        confidence: 0.89,
        trend: 'rising',
        targetAudience: 'Brand managers, startup founders, community managers',
        estimatedEngagement: 81,
        keywordScore: 88
      },
      {
        id: '5',
        title: 'Micro-Learning: The Future of Skill Development',
        description: 'Exploring bite-sized learning approaches that fit into busy schedules and improve retention.',
        category: 'Education',
        reasoning: 'Learning content performs well. Micro-learning trending in corporate training sectors.',
        confidence: 0.76,
        trend: 'rising',
        targetAudience: 'L&D professionals, educators, busy professionals',
        estimatedEngagement: 69,
        keywordScore: 71
      }
    ];
    
    setSuggestions(mockSuggestions);
    setIsLoading(false);
  };

  useEffect(() => {
    generateSuggestions();
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.8) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'stable':
        return <Target className="w-4 h-4 text-blue-600" />;
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-neutral-100 shadow-soft ${className}`}>
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">AI Content Suggestions</h3>
              <p className="text-sm text-neutral-600">Trending topics tailored to your audience</p>
            </div>
          </div>
          
          <button
            onClick={generateSuggestions}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="border border-neutral-200 rounded-xl p-4 hover:border-sage/30 hover:bg-sage/5 transition-all duration-200 cursor-pointer group"
                onClick={() => onSuggestionSelect?.(suggestion)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-neutral-900 group-hover:text-sage transition-colors">
                        {suggestion.title}
                      </h4>
                      {getTrendIcon(suggestion.trend)}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {suggestion.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getConfidenceColor(suggestion.confidence)}`}>
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-sage transition-colors" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>Engagement: {suggestion.estimatedEngagement}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>SEO Score: {suggestion.keywordScore}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-neutral-100 rounded-lg">
                    {suggestion.category}
                  </span>
                </div>

                {showDetails === suggestion.id && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-neutral-900 mb-1">AI Reasoning</h5>
                        <p className="text-neutral-600">{suggestion.reasoning}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-neutral-900 mb-1">Target Audience</h5>
                        <p className="text-neutral-600">{suggestion.targetAudience}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(showDetails === suggestion.id ? null : suggestion.id);
                  }}
                  className="mt-3 text-xs text-sage hover:text-sage/80 font-medium"
                >
                  {showDetails === suggestion.id ? 'Hide Details' : 'Show AI Analysis'}
                </button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && suggestions.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-neutral-900 mb-2">No suggestions available</h4>
            <p className="text-neutral-600 mb-4">Try refreshing to get new AI-powered content ideas</p>
            <button
              onClick={generateSuggestions}
              className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200"
            >
              Generate Suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestions;
