import React, { useState, useEffect, useMemo } from 'react';
import { Users, MessageCircle, Edit3, Clock, TrendingUp, Activity, Eye } from 'lucide-react';
import { useCollaboration } from '../../contexts/CollaborationContext';
import { collaborationService } from '../../services/collaboration';

interface AnalyticsData {
  activeUsers: number;
  totalComments: number;
  totalEdits: number;
  currentlyTyping: number;
  sessionsToday: number;
  avgSessionDuration: string;
  mostActiveUser: string;
  peakHour: string;
}

interface UserActivity {
  userId: string;
  userName: string;
  avatar?: string;
  commentsCount: number;
  editsCount: number;
  timeSpent: string;
  lastActive: string;
}

const CollaborationAnalytics: React.FC = () => {
  const { activeUsers, comments, isConnected } = useCollaboration();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Calculate analytics data
  const calculatedAnalytics = useMemo(() => {
    if (!isConnected) return null;

    const baseAnalytics = collaborationService.getCollaborationAnalytics();
    
    // Mock additional analytics data
    const mockAnalytics: AnalyticsData = {
      ...baseAnalytics,
      sessionsToday: 8,
      avgSessionDuration: '2h 15m',
      mostActiveUser: 'Sarah Chen',
      peakHour: '2:00 PM - 3:00 PM'
    };

    return mockAnalytics;
  }, [isConnected, activeUsers, comments]);

  // Calculate user activities
  const calculatedUserActivities = useMemo(() => {
    const activities: UserActivity[] = activeUsers.map(user => ({
      userId: user.userId,
      userName: user.userName,
      avatar: user.userAvatar,
      commentsCount: Math.floor(Math.random() * 15) + 1,
      editsCount: Math.floor(Math.random() * 25) + 5,
      timeSpent: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
      lastActive: user.isOnline ? 'Now' : new Date(user.lastSeen).toLocaleDateString()
    }));

    return activities.sort((a, b) => b.commentsCount + b.editsCount - (a.commentsCount + a.editsCount));
  }, [activeUsers]);

  useEffect(() => {
    setAnalytics(calculatedAnalytics);
    setUserActivities(calculatedUserActivities);
  }, [calculatedAnalytics, calculatedUserActivities]);

  if (!isConnected || !analytics) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft p-6">
        <div className="text-center text-neutral-500">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Analytics not available</p>
          <p className="text-sm">Connect to collaboration service to view analytics</p>
        </div>
      </div>
    );
  }

  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return 'Today';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Collaboration Analytics</h2>
          <p className="text-neutral-600">Track team collaboration and engagement</p>
        </div>
        
        <div className="flex bg-neutral-100 rounded-xl p-1">
          {(['today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === range
                  ? 'bg-white shadow-soft text-sage'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {range === 'today' ? 'Today' : range === 'week' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-lg">
              +12% vs yesterday
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">{analytics.activeUsers}</div>
          <div className="text-sm text-neutral-600">Active Users</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-lg">
              +8% vs yesterday
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">{analytics.totalComments}</div>
          <div className="text-sm text-neutral-600">Comments {getTimeRangeText()}</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-lg">
              +15% vs yesterday
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">{analytics.totalEdits}</div>
          <div className="text-sm text-neutral-600">Live Edits {getTimeRangeText()}</div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-lg">
              Real-time
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">{analytics.currentlyTyping}</div>
          <div className="text-sm text-neutral-600">Currently Typing</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <h3 className="font-medium text-neutral-900 mb-4">Session Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Sessions {getTimeRangeText()}</span>
              <span className="font-medium text-neutral-900">{analytics.sessionsToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Avg. Session Duration</span>
              <span className="font-medium text-neutral-900">{analytics.avgSessionDuration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Most Active User</span>
              <span className="font-medium text-neutral-900">{analytics.mostActiveUser}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Peak Activity</span>
              <span className="font-medium text-neutral-900">{analytics.peakHour}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <h3 className="font-medium text-neutral-900 mb-4">Engagement Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sage/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-sage" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Comments up 23%</p>
                <p className="text-xs text-neutral-600">Compared to last week</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Active viewing increased</p>
                <p className="text-xs text-neutral-600">More users reviewing content</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">Peak collaboration hours</p>
                <p className="text-xs text-neutral-600">2-4 PM most active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Leaderboard */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
        <div className="p-6 border-b border-neutral-100">
          <h3 className="font-medium text-neutral-900">Top Contributors</h3>
          <p className="text-sm text-neutral-600">Most active team members {getTimeRangeText().toLowerCase()}</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {userActivities.slice(0, 5).map((user, index) => (
              <div key={user.userId} className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-neutral-100 text-neutral-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-sage flex items-center justify-center text-white text-xs font-medium">
                        {user.userName.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{user.userName}</p>
                    <p className="text-xs text-neutral-600">Last active: {user.lastActive}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-neutral-900">{user.commentsCount}</div>
                    <div className="text-xs text-neutral-600">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-neutral-900">{user.editsCount}</div>
                    <div className="text-xs text-neutral-600">Edits</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-neutral-900">{user.timeSpent}</div>
                    <div className="text-xs text-neutral-600">Time</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationAnalytics;
