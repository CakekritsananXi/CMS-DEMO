import React, { useState, useEffect } from 'react';
import { Calendar, Lightbulb, Target, TrendingUp, Clock, Users, ArrowUp, ArrowDown, Smartphone } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import ContentPillars from '../components/dashboard/ContentPillars';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import MobileOptimizationSummary from '../components/mobile/MobileOptimizationSummary';
import { useAnalytics } from '../hooks/useAnalytics';
import { getDeviceCapabilities } from '../utils/mobile';

const Dashboard = () => {
  // Sample content data (in real app, this would come from props or context)
  const [contentData] = useState([
    {
      id: '1',
      title: 'Blog Post Draft',
      type: 'blog',
      status: 'draft',
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: '14:00',
      pillar: 'Thought Leadership',
      priority: 'medium',
      assignee: 'john-doe'
    },
    {
      id: '2',
      title: 'Social Media Series',
      type: 'social',
      status: 'scheduled',
      scheduledDate: format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      scheduledTime: '10:00',
      pillar: 'Community Building',
      priority: 'high',
      assignee: 'jane-smith'
    },
    {
      id: '3',
      title: 'Newsletter Template',
      type: 'email',
      status: 'review',
      scheduledDate: format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      scheduledTime: '09:00',
      pillar: 'Product Education',
      priority: 'medium',
      assignee: 'mike-johnson'
    }
  ]);

  const [timeRange, setTimeRange] = useState('month');

  // Calculate dashboard metrics
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const contentThisMonth = contentData.filter(item => {
    if (!item.scheduledDate) return false;
    const scheduledDate = parseISO(item.scheduledDate);
    return isWithinInterval(scheduledDate, { start: monthStart, end: monthEnd });
  }).length;

  const contentByStatus = contentData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const contentByType = contentData.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const contentByPillar = contentData.reduce((acc, item) => {
    acc[item.pillar] = (acc[item.pillar] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Good morning, Sarah</h1>
        <p className="text-sm sm:text-base text-neutral-600">Let's make today's content planning productive and strategic.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250 cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center group-hover:bg-sage/20 transition-colors">
              <Calendar className="w-5 h-5 text-sage" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-neutral-900">{contentThisMonth}</span>
              <div className="flex items-center text-green-600 text-xs ml-auto">
                <ArrowUp className="w-3 h-3 mr-1" />
                +12%
              </div>
            </div>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-600">Content Planned</h3>
          <p className="text-xs text-neutral-500 mt-1 hidden sm:block">This month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250 cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warm-blue/10 rounded-xl flex items-center justify-center group-hover:bg-warm-blue/20 transition-colors">
              <Lightbulb className="w-5 h-5 text-warm-blue" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-neutral-900">{contentByStatus.draft || 0}</span>
              <div className="flex items-center text-blue-600 text-xs ml-auto">
                <ArrowUp className="w-3 h-3 mr-1" />
                +5
              </div>
            </div>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-600">Draft Content</h3>
          <p className="text-xs text-neutral-500 mt-1 hidden sm:block">Ready to develop</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250 cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warm-amber/10 rounded-xl flex items-center justify-center group-hover:bg-warm-amber/20 transition-colors">
              <Target className="w-5 h-5 text-warm-amber" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-neutral-900">{Math.round((contentByStatus.published || 0) / Math.max(contentData.length, 1) * 100)}%</span>
              <div className="flex items-center text-green-600 text-xs ml-auto">
                <ArrowUp className="w-3 h-3 mr-1" />
                +7%
              </div>
            </div>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-600">Completion Rate</h3>
          <p className="text-xs text-neutral-500 mt-1 hidden sm:block">Content goals</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-250 cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-soft-emerald/10 rounded-xl flex items-center justify-center group-hover:bg-soft-emerald/20 transition-colors">
              <TrendingUp className="w-5 h-5 text-soft-emerald" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-neutral-900">+12%</span>
              <div className="flex items-center text-green-600 text-xs ml-auto">
                <ArrowUp className="w-3 h-3 mr-1" />
                +3%
              </div>
            </div>
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
