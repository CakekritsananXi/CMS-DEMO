import React, { useState } from 'react';
import { Users, MessageCircle, Clock, Plus, BarChart3, AlertTriangle, Settings } from 'lucide-react';
import TeamMembers from '../components/collaboration/TeamMembers';
import RecentCollaboration from '../components/collaboration/RecentCollaboration';
import SharedProjects from '../components/collaboration/SharedProjects';
import ActivityFeed from '../components/collaboration/ActivityFeed';
import CollaborationAnalytics from '../components/collaboration/CollaborationAnalytics';
import ConflictResolution from '../components/collaboration/ConflictResolution';
import ErrorBoundary from '../components/ErrorBoundary';
import { LoadingOverlay } from '../components/Loading';

const Collaboration = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Team Collaboration</h1>
          <p className="text-neutral-600">Work together on content strategy and execution</p>
        </div>
        
        <button className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 shadow-soft">
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-sage" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">5</div>
          <div className="text-sm text-neutral-600">Team Members</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">23</div>
          <div className="text-sm text-neutral-600">Active Discussions</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">12</div>
          <div className="text-sm text-neutral-600">Pending Reviews</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SharedProjects />
          <RecentCollaboration />
        </div>
        
        <div className="space-y-8">
          <TeamMembers />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
