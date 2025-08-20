import React from 'react';
import { useTyping } from '../../contexts/CollaborationContext';
import { useActiveUsers } from '../../contexts/CollaborationContext';

interface TypingIndicatorProps {
  contentId: string;
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ contentId, className = '' }) => {
  const { typingUsers, isUserTyping } = useTyping();
  const { activeUsers } = useActiveUsers();

  const currentlyTypingUserIds = typingUsers.get(contentId) || [];
  const typingUserNames = currentlyTypingUserIds
    .map(userId => {
      const user = activeUsers.find(u => u.userId === userId);
      return user?.userName || 'Someone';
    })
    .filter(Boolean);

  if (typingUserNames.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (typingUserNames.length === 1) {
      return `${typingUserNames[0]} is typing...`;
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    } else {
      return `${typingUserNames[0]} and ${typingUserNames.length - 1} others are typing...`;
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}>
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="italic">{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;
