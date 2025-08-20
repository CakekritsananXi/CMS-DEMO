import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  collaborationService,
  UserPresence,
  Comment,
  LiveEdit,
  CollaborationEvent
} from '../services/collaboration';

interface CollaborationContextType {
  // Connection state
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  reconnectAttempts: number;

  // Users and presence
  activeUsers: UserPresence[];
  currentUserPresence: UserPresence | null;
  
  // Comments
  comments: Map<string, Comment[]>;
  
  // Live editing
  liveEdits: Map<string, LiveEdit[]>;
  typingUsers: Map<string, string[]>; // contentId -> userIds
  
  // Actions
  connect: () => Promise<boolean>;
  disconnect: () => void;
  updatePresence: (location: string, cursor?: { x: number; y: number }) => void;
  addComment: (contentId: string, content: string, position?: { x: number; y: number }) => Comment | null;
  replyToComment: (commentId: string, content: string) => Comment | null;
  resolveComment: (commentId: string) => boolean;
  startTyping: (contentId: string) => void;
  stopTyping: (contentId: string) => void;
  
  // Helpers
  getActiveUsersInLocation: (location: string) => UserPresence[];
  getCommentsForContent: (contentId: string) => Comment[];
  isUserTyping: (contentId: string, userId: string) => boolean;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

interface CollaborationProviderProps {
  children: ReactNode;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [currentUserPresence, setCurrentUserPresence] = useState<UserPresence | null>(null);
  const [comments, setComments] = useState<Map<string, Comment[]>>(new Map());
  const [liveEdits, setLiveEdits] = useState<Map<string, LiveEdit[]>>(new Map());
  const [typingUsers, setTypingUsers] = useState<Map<string, string[]>>(new Map());

  // Connect when user is authenticated
  useEffect(() => {
    if (user && !isConnected) {
      connect();
    } else if (!user && isConnected) {
      disconnect();
    }
  }, [user]);

  // Setup event listeners
  useEffect(() => {
    const handleUserJoin = (data: any) => {
      refreshActiveUsers();
    };

    const handleUserLeave = (data: any) => {
      refreshActiveUsers();
    };

    const handlePresenceUpdate = (data: any) => {
      refreshActiveUsers();
      if (data.userId === user?.id) {
        const presence = collaborationService.getUserPresence(user.id);
        setCurrentUserPresence(presence);
      }
    };

    const handleContentEdit = (edit: LiveEdit) => {
      setLiveEdits(prev => {
        const newMap = new Map(prev);
        const edits = newMap.get(edit.contentId) || [];
        edits.push(edit);
        newMap.set(edit.contentId, edits);
        return newMap;
      });
    };

    const handleCommentAdd = (comment: Comment) => {
      setComments(prev => {
        const newMap = new Map(prev);
        const contentComments = newMap.get(comment.contentId) || [];
        contentComments.push(comment);
        newMap.set(comment.contentId, contentComments);
        return newMap;
      });
    };

    const handleTypingStart = (data: { userId: string; contentId: string }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const users = newMap.get(data.contentId) || [];
        if (!users.includes(data.userId)) {
          users.push(data.userId);
          newMap.set(data.contentId, users);
        }
        return newMap;
      });
    };

    const handleTypingStop = (data: { userId: string; contentId: string }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const users = newMap.get(data.contentId) || [];
        const filteredUsers = users.filter(id => id !== data.userId);
        newMap.set(data.contentId, filteredUsers);
        return newMap;
      });
    };

    // Register event listeners
    collaborationService.on('user_join', handleUserJoin);
    collaborationService.on('user_leave', handleUserLeave);
    collaborationService.on('presence_update', handlePresenceUpdate);
    collaborationService.on('content_edit', handleContentEdit);
    collaborationService.on('comment_add', handleCommentAdd);
    collaborationService.on('typing_start', handleTypingStart);
    collaborationService.on('typing_stop', handleTypingStop);

    return () => {
      collaborationService.off('user_join', handleUserJoin);
      collaborationService.off('user_leave', handleUserLeave);
      collaborationService.off('presence_update', handlePresenceUpdate);
      collaborationService.off('content_edit', handleContentEdit);
      collaborationService.off('comment_add', handleCommentAdd);
      collaborationService.off('typing_start', handleTypingStart);
      collaborationService.off('typing_stop', handleTypingStop);
    };
  }, [user]);

  // Track location changes
  useEffect(() => {
    if (isConnected) {
      updatePresence(window.location.pathname);
    }
  }, [window.location.pathname, isConnected]);

  const connect = async (): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const connected = await collaborationService.connect({
        id: user.id,
        name: user.name,
        avatar: user.avatar
      });
      
      setIsConnected(connected);
      
      if (connected) {
        refreshActiveUsers();
        refreshComments();
        
        // Start activity simulation
        collaborationService.simulateActivity();
      }
      
      return connected;
    } catch (error) {
      console.error('Failed to connect to collaboration service:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    collaborationService.disconnect();
    setIsConnected(false);
    setActiveUsers([]);
    setCurrentUserPresence(null);
    setComments(new Map());
    setLiveEdits(new Map());
    setTypingUsers(new Map());
  };

  const updatePresence = (location: string, cursor?: { x: number; y: number }) => {
    if (isConnected) {
      collaborationService.updatePresence(location, cursor);
      const presence = user ? collaborationService.getUserPresence(user.id) : null;
      setCurrentUserPresence(presence);
    }
  };

  const refreshActiveUsers = () => {
    const users = collaborationService.getActiveUsers();
    setActiveUsers(users);
  };

  const refreshComments = () => {
    // In a real app, this would fetch comments from the backend
    // For now, we'll use the service's mock data
    const newCommentsMap = new Map<string, Comment[]>();
    // This is a simplified version - in practice, you'd fetch all content IDs
    ['content-1', 'content-2', 'content-3'].forEach(contentId => {
      const contentComments = collaborationService.getComments(contentId);
      if (contentComments.length > 0) {
        newCommentsMap.set(contentId, contentComments);
      }
    });
    setComments(newCommentsMap);
  };

  const addComment = (contentId: string, content: string, position?: { x: number; y: number }): Comment | null => {
    return collaborationService.addComment(contentId, content, position);
  };

  const replyToComment = (commentId: string, content: string): Comment | null => {
    return collaborationService.replyToComment(commentId, content);
  };

  const resolveComment = (commentId: string): boolean => {
    return collaborationService.resolveComment(commentId);
  };

  const startTyping = (contentId: string) => {
    collaborationService.startTyping(contentId);
  };

  const stopTyping = (contentId: string) => {
    collaborationService.stopTyping(contentId);
  };

  const getActiveUsersInLocation = (location: string): UserPresence[] => {
    return collaborationService.getActiveUsers(location);
  };

  const getCommentsForContent = (contentId: string): Comment[] => {
    return comments.get(contentId) || [];
  };

  const isUserTyping = (contentId: string, userId: string): boolean => {
    const users = typingUsers.get(contentId) || [];
    return users.includes(userId);
  };

  const value: CollaborationContextType = {
    isConnected,
    isLoading,
    activeUsers,
    currentUserPresence,
    comments,
    liveEdits,
    typingUsers,
    connect,
    disconnect,
    updatePresence,
    addComment,
    replyToComment,
    resolveComment,
    startTyping,
    stopTyping,
    getActiveUsersInLocation,
    getCommentsForContent,
    isUserTyping
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = (): CollaborationContextType => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

// Convenience hooks
export const useActiveUsers = () => {
  const { activeUsers, getActiveUsersInLocation } = useCollaboration();
  return { activeUsers, getActiveUsersInLocation };
};

export const useComments = () => {
  const { 
    comments, 
    addComment, 
    replyToComment, 
    resolveComment, 
    getCommentsForContent 
  } = useCollaboration();
  return { 
    comments, 
    addComment, 
    replyToComment, 
    resolveComment, 
    getCommentsForContent 
  };
};

export const usePresence = () => {
  const { 
    currentUserPresence, 
    updatePresence, 
    isConnected 
  } = useCollaboration();
  return { 
    currentUserPresence, 
    updatePresence, 
    isConnected 
  };
};

export const useTyping = () => {
  const { 
    typingUsers, 
    startTyping, 
    stopTyping, 
    isUserTyping 
  } = useCollaboration();
  return { 
    typingUsers, 
    startTyping, 
    stopTyping, 
    isUserTyping 
  };
};
