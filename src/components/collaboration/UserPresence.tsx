import React from 'react';
import { Users, Circle } from 'lucide-react';
import { useActiveUsers } from '../../contexts/CollaborationContext';
import { useAuth } from '../../contexts/AuthContext';

interface UserPresenceProps {
  location?: string;
  showDetails?: boolean;
  maxVisible?: number;
}

const UserPresence: React.FC<UserPresenceProps> = ({ 
  location, 
  showDetails = false, 
  maxVisible = 5 
}) => {
  const { activeUsers, getActiveUsersInLocation } = useActiveUsers();
  const { user: currentUser } = useAuth();

  const relevantUsers = location 
    ? getActiveUsersInLocation(location)
    : activeUsers;

  // Filter out current user and limit visible users
  const otherUsers = relevantUsers
    .filter(user => user.userId !== currentUser?.id)
    .slice(0, maxVisible);

  const remainingCount = Math.max(0, relevantUsers.length - maxVisible);

  if (otherUsers.length === 0) {
    return null;
  }

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex items-center space-x-2">
      {/* User Avatars */}
      <div className="flex -space-x-2">
        {otherUsers.map((user) => (
          <div
            key={user.userId}
            className="relative group"
            title={`${user.userName} - ${user.isOnline ? 'Online' : `Last seen ${getTimeAgo(user.lastSeen)}`}`}
          >
            <div 
              className="w-8 h-8 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm hover:scale-110 transition-transform duration-200"
              style={{ borderColor: user.color }}
            >
              {user.userAvatar ? (
                <img 
                  src={user.userAvatar} 
                  alt={user.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: user.color }}
                >
                  {user.userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Online Status */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} />

            {/* Hover Tooltip */}
            {showDetails && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                <div className="font-medium">{user.userName}</div>
                <div className="text-gray-300">
                  {user.isOnline ? 'Online' : `Last seen ${getTimeAgo(user.lastSeen)}`}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 shadow-sm">
            +{remainingCount}
          </div>
        )}
      </div>

      {/* Summary Text */}
      {showDetails && (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            {otherUsers.length === 1 
              ? `${otherUsers[0].userName} is here`
              : `${otherUsers.length} people here`
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default UserPresence;
