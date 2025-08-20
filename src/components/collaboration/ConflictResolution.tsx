import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Check, X, GitMerge, Clock, ArrowRight } from 'lucide-react';
import { useCollaboration } from '../../contexts/CollaborationContext';

interface Conflict {
  id: string;
  contentId: string;
  type: 'text_edit' | 'property_change' | 'deletion' | 'creation';
  description: string;
  users: {
    userId: string;
    userName: string;
    avatar?: string;
    change: string;
    timestamp: string;
  }[];
  status: 'pending' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const mockConflicts: Conflict[] = [
  {
    id: 'conflict-1',
    contentId: 'content-1',
    type: 'text_edit',
    description: 'Conflicting edits to main headline',
    users: [
      {
        userId: '1',
        userName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=100&h=100&fit=crop&crop=face',
        change: 'Changed "Innovative Solutions" to "Revolutionary Solutions"',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        userId: '2',
        userName: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        change: 'Changed "Innovative Solutions" to "Smart Solutions"',
        timestamp: '2024-01-15T10:32:00Z'
      }
    ],
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-15T10:35:00Z'
  },
  {
    id: 'conflict-2',
    contentId: 'content-2',
    type: 'property_change',
    description: 'Different color scheme selections',
    users: [
      {
        userId: '3',
        userName: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        change: 'Set primary color to #3B82F6',
        timestamp: '2024-01-15T09:15:00Z'
      },
      {
        userId: '4',
        userName: 'David Lee',
        change: 'Set primary color to #10B981',
        timestamp: '2024-01-15T09:18:00Z'
      }
    ],
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-15T09:20:00Z'
  }
];

const ConflictResolution: React.FC = () => {
  const { isConnected } = useCollaboration();
  const [conflicts, setConflicts] = useState<Conflict[]>(mockConflicts);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [resolutionMode, setResolutionMode] = useState<'manual' | 'automatic'>('manual');

  const getPriorityColor = (priority: Conflict['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getTypeIcon = (type: Conflict['type']) => {
    switch (type) {
      case 'text_edit': return <GitMerge className="w-4 h-4" />;
      case 'property_change': return <AlertTriangle className="w-4 h-4" />;
      case 'deletion': return <X className="w-4 h-4" />;
      case 'creation': return <Check className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleResolveConflict = (conflictId: string, resolution: 'accept_first' | 'accept_second' | 'merge' | 'reject') => {
    setConflicts(prev => 
      prev.map(conflict => 
        conflict.id === conflictId 
          ? { ...conflict, status: 'resolved' as const }
          : conflict
      )
    );
    setSelectedConflict(null);
  };

  const handleAutoResolve = () => {
    // Simulate automatic conflict resolution
    setConflicts(prev => 
      prev.map(conflict => ({
        ...conflict,
        status: 'resolved' as const
      }))
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const pendingConflicts = conflicts.filter(c => c.status === 'pending');
  const resolvedConflicts = conflicts.filter(c => c.status === 'resolved');

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-soft p-6">
        <div className="text-center text-neutral-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Conflict resolution not available</p>
          <p className="text-sm">Connect to collaboration service to manage conflicts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Conflict Resolution</h2>
          <p className="text-neutral-600">Manage and resolve collaboration conflicts</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => setResolutionMode('manual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                resolutionMode === 'manual'
                  ? 'bg-white shadow-soft text-sage'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setResolutionMode('automatic')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                resolutionMode === 'automatic'
                  ? 'bg-white shadow-soft text-sage'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Automatic
            </button>
          </div>

          {pendingConflicts.length > 0 && resolutionMode === 'automatic' && (
            <button
              onClick={handleAutoResolve}
              className="bg-sage text-white px-4 py-2 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200"
            >
              Auto-Resolve All
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{pendingConflicts.length}</div>
              <div className="text-sm text-neutral-600">Pending Conflicts</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{resolvedConflicts.length}</div>
              <div className="text-sm text-neutral-600">Resolved Today</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">2.3m</div>
              <div className="text-sm text-neutral-600">Avg. Resolution Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
            <div className="p-6 border-b border-neutral-100">
              <h3 className="font-medium text-neutral-900">Active Conflicts</h3>
            </div>

            <div className="divide-y divide-neutral-100">
              {pendingConflicts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">All conflicts resolved!</h3>
                  <p className="text-neutral-600">Your team is working in harmony.</p>
                </div>
              ) : (
                pendingConflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    className={`p-6 cursor-pointer hover:bg-neutral-50 transition-colors duration-200 ${
                      selectedConflict?.id === conflict.id ? 'bg-sage/5' : ''
                    }`}
                    onClick={() => setSelectedConflict(conflict)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(conflict.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-neutral-900">{conflict.description}</h4>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(conflict.priority)}`}>
                            {conflict.priority}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex -space-x-2">
                            {conflict.users.map((user) => (
                              <div
                                key={user.userId}
                                className="w-6 h-6 rounded-full border-2 border-white bg-neutral-200 overflow-hidden"
                                title={user.userName}
                              >
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-sage flex items-center justify-center text-white text-xs">
                                    {user.userName.charAt(0)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-neutral-600">{conflict.users.length} users involved</span>
                          <span className="text-sm text-neutral-500">{formatTimeAgo(conflict.createdAt)}</span>
                        </div>

                        <div className="text-sm text-neutral-600">
                          Click to review and resolve this conflict
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Conflict Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-soft">
            {selectedConflict ? (
              <>
                <div className="p-6 border-b border-neutral-100">
                  <h3 className="font-medium text-neutral-900 mb-2">Conflict Details</h3>
                  <p className="text-sm text-neutral-600">{selectedConflict.description}</p>
                </div>

                <div className="p-6 space-y-4">
                  {selectedConflict.users.map((user, index) => (
                    <div key={user.userId} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-sage flex items-center justify-center text-white text-xs font-medium">
                              {user.userName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{user.userName}</p>
                          <p className="text-xs text-neutral-500">{formatTimeAgo(user.timestamp)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 mb-3">{user.change}</p>
                      <button
                        onClick={() => handleResolveConflict(selectedConflict.id, index === 0 ? 'accept_first' : 'accept_second')}
                        className="w-full bg-sage/10 text-sage border border-sage/20 px-3 py-2 rounded-lg text-sm font-medium hover:bg-sage/20 transition-colors duration-200"
                      >
                        Accept This Change
                      </button>
                    </div>
                  ))}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleResolveConflict(selectedConflict.id, 'merge')}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
                    >
                      Merge Changes
                    </button>
                    <button
                      onClick={() => handleResolveConflict(selectedConflict.id, 'reject')}
                      className="flex-1 border border-neutral-200 text-neutral-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors duration-200"
                    >
                      Reject All
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <GitMerge className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Select a Conflict</h3>
                <p className="text-neutral-600">Choose a conflict from the list to review and resolve it.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolution;
