import React from 'react';
import { Crown, Shield, User, MoreHorizontal } from 'lucide-react';

const TeamMembers = () => {
  const members = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Content Lead',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'online',
      permissions: 'owner',
      lastActive: 'Just now',
    },
    {
      id: 2,
      name: 'Mike Johnson',
      role: 'Content Strategist',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'online',
      permissions: 'admin',
      lastActive: '5 min ago',
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Designer',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'away',
      permissions: 'editor',
      lastActive: '2 hours ago',
    },
    {
      id: 4,
      name: 'John Wilson',
      role: 'Video Producer',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'offline',
      permissions: 'editor',
      lastActive: '1 day ago',
    },
    {
      id: 5,
      name: 'Lisa Park',
      role: 'Social Media Manager',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'online',
      permissions: 'editor',
      lastActive: '30 min ago',
    },
  ];

  const handleMemberAction = (memberId: number, action: string) => {
    console.log(`${action} member:`, memberId);
    // Implement member management actions
  };
  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'owner':
        return <Crown className="w-3 h-3 text-warm-amber" />;
      case 'admin':
        return <Shield className="w-3 h-3 text-warm-blue" />;
      default:
        return <User className="w-3 h-3 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'away':
        return 'bg-amber-500';
      default:
        return 'bg-neutral-400';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">Team Members</h2>
        <button 
          onClick={() => console.log('Manage team clicked')}
          className="text-sage hover:text-sage/80 text-sm font-medium transition-colors duration-200"
        >
          Manage Team
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-neutral-900">{member.name}</span>
                  {getPermissionIcon(member.permissions)}
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <span>{member.role}</span>
                  <span>•</span>
                  <span>{member.lastActive}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleMemberAction(member.id, 'manage')}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-neutral-200 rounded-lg"
            >
              <MoreHorizontal className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;