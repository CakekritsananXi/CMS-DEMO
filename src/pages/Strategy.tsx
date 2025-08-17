import React from 'react';
import { Target, FileText, TrendingUp, Users } from 'lucide-react';
import ContentPillarsStrategy from '../components/strategy/ContentPillarsStrategy';
import ContentBriefs from '../components/strategy/ContentBriefs';
import StrategicGoals from '../components/strategy/StrategicGoals';

const Strategy = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Content Strategy</h1>
        <p className="text-neutral-600">Define your strategic approach and create comprehensive content plans</p>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-sage" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">4</div>
          <div className="text-sm text-neutral-600">Content Pillars</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-warm-blue" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">12</div>
          <div className="text-sm text-neutral-600">Active Briefs</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-dusty-purple/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-dusty-purple" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">89%</div>
          <div className="text-sm text-neutral-600">Goal Progress</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-warm-amber/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-warm-amber" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">5</div>
          <div className="text-sm text-neutral-600">Team Members</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ContentBriefs />
          <ContentPillarsStrategy />
        </div>
        
        <div>
          <StrategicGoals />
        </div>
      </div>
    </div>
  );
};

export default Strategy;