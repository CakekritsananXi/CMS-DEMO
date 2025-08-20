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
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'conflicts' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Team Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      
      case 'analytics':
        return <CollaborationAnalytics />;
      
      case 'conflicts':
        return <ConflictResolution />;
      
      case 'settings':
        return (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-soft p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Collaboration Settings</h3>
              <p className="text-neutral-600 mb-6">Configure your team collaboration preferences and permissions.</p>
              
              <div className="space-y-6 text-left max-w-2xl mx-auto">
                <div className="border border-neutral-200 rounded-xl p-6">
                  <h4 className="font-medium text-neutral-900 mb-3">Real-time Features</h4>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage" defaultChecked />
                      <span className="text-sm text-neutral-700">Enable live cursors</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage" defaultChecked />
                      <span className="text-sm text-neutral-700">Show typing indicators</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage" defaultChecked />
                      <span className="text-sm text-neutral-700">Enable presence indicators</span>
                    </label>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-xl p-6">
                  <h4 className="font-medium text-neutral-900 mb-3">Notifications</h4>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage" defaultChecked />
                      <span className="text-sm text-neutral-700">New comments</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage" defaultChecked />
                      <span className="text-sm text-neutral-700">Content changes</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-sage border-neutral-300 rounded focus:ring-sage" />
                      <span className="text-sm text-neutral-700">User joins/leaves</span>
                    </label>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-xl p-6">
                  <h4 className="font-medium text-neutral-900 mb-3">Conflict Resolution</h4>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="conflict-mode" className="w-4 h-4 text-sage border-neutral-300 focus:ring-sage" defaultChecked />
                      <span className="text-sm text-neutral-700">Manual resolution</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="conflict-mode" className="w-4 h-4 text-sage border-neutral-300 focus:ring-sage" />
                      <span className="text-sm text-neutral-700">Automatic resolution (last edit wins)</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="conflict-mode" className="w-4 h-4 text-sage border-neutral-300 focus:ring-sage" />
                      <span className="text-sm text-neutral-700">Smart merge (experimental)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-3 mt-8">
                <button className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200">
                  Save Settings
                </button>
                <button className="border border-neutral-200 text-neutral-700 px-6 py-3 rounded-xl font-medium hover:bg-neutral-50 transition-colors duration-200">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <LoadingOverlay isLoading={isLoading}>
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

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl border border-neutral-200 mb-8 shadow-soft">
            <div className="flex border-b border-neutral-100 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-sage border-b-2 border-sage bg-sage/5'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.id === 'conflicts' && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">2</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>
      </LoadingOverlay>
    </ErrorBoundary>
  );
};

export default Collaboration;
