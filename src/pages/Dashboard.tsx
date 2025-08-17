import React from 'react';
import { Calendar, Lightbulb, Target, TrendingUp, Clock, Users } from 'lucide-react';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import ContentPillars from '../components/dashboard/ContentPillars';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Good morning, Sarah</h1>
        <p className="text-sm sm:text-base text-neutral-600">Let's make today's content planning productive and strategic.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-sage" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">23</span>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-600">Content Planned</h3>
          <p className="text-xs text-neutral-500 mt-1 hidden sm:block">This month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warm-blue/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-warm-blue" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">47</span>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-600">Ideas Captured</h3>
          <p className="text-xs text-neutral-500 mt-1 hidden sm:block">Ready to develop</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warm-amber/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-warm-amber" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">89%</span>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-600">Goal Progress</h3>
          <p className="text-xs text-neutral-500 mt-1 hidden sm:block">Content strategy</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-soft-emerald/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-soft-emerald" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">+12%</span>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-600">Engagement</h3>
          <p className="text-xs text-neutral-500 mt-1 hidden sm:block">vs last month</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          <QuickActions />
          <ContentPillars />
        </div>
        
        <div className="space-y-6 lg:space-y-8">
          <UpcomingDeadlines />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;