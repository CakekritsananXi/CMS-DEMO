interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface UserPresence extends User {
  userId: string;
  userName: string;
  userAvatar?: string;
  isOnline: boolean;
  lastSeen: string;
  location: string;
  color: string;
  cursor?: { x: number; y: number };
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  contentId: string;
  content: string;
  timestamp: string;
  position?: { x: number; y: number };
  isResolved: boolean;
  replies: Comment[];
  parentId?: string;
}

export interface LiveEdit {
  id: string;
  userId: string;
  userName: string;
  contentId: string;
  operation: 'insert' | 'delete' | 'replace';
  data: any;
  timestamp: string;
  position?: { line: number; column: number };
}

export interface CollaborationEvent {
  type: 'user_join' | 'user_leave' | 'presence_update' | 'content_edit' | 'comment_add' | 'typing_start' | 'typing_stop' | 'cursor_move';
  data: any;
  timestamp: string;
}

export interface Cursor {
  userId: string;
  userName: string;
  color: string;
  cursor: { x: number; y: number };
}

class CollaborationService {
  private ws: WebSocket | null = null;
  private currentUser: User | null = null;
  private activeUsers: Map<string, UserPresence> = new Map();
  private comments: Map<string, Comment[]> = new Map();
  private liveEdits: Map<string, LiveEdit[]> = new Map();
  private typingUsers: Map<string, Set<string>> = new Map();
  private cursors: Map<string, Cursor> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  // Color palette for users
  private userColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  private getNextColor(): string {
    const usedColors = Array.from(this.activeUsers.values()).map(u => u.color);
    const availableColors = this.userColors.filter(color => !usedColors.includes(color));
    return availableColors.length > 0 ? availableColors[0] : this.userColors[Math.floor(Math.random() * this.userColors.length)];
  }

  async connect(user: User): Promise<boolean> {
    try {
      this.currentUser = user;
      
      // For now, simulate WebSocket connection since we don't have a backend
      // In production, this would connect to a real WebSocket server
      await this.simulateConnection();
      
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Add current user to active users
      this.addUserPresence(user);

      // Start simulating activity
      this.simulateActivity();

      this.emit('user_join', { user });
      return true;
    } catch (error) {
      console.error('Failed to connect:', error);
      this.handleConnectionError();
      return false;
    }
  }

  private async simulateConnection(): Promise<void> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Initialize with some mock data
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Add some mock users
    const mockUsers = [
      { id: '2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=100&h=100&fit=crop&crop=face' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
      { id: '4', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
    ];

    mockUsers.forEach(user => {
      if (user.id !== this.currentUser?.id) {
        this.addUserPresence(user, '/collaboration');
      }
    });

    // Add some mock comments
    this.addMockComments();
  }

  private addUserPresence(user: User, location: string = window.location.pathname): void {
    const presence: UserPresence = {
      ...user,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      isOnline: true,
      lastSeen: new Date().toISOString(),
      location,
      color: this.getNextColor(),
      cursor: { x: 0, y: 0 }
    };

    this.activeUsers.set(user.id, presence);
    this.emit('presence_update', { presence });
  }

  private addMockComments(): void {
    const mockComments: Comment[] = [
      {
        id: 'comment-1',
        userId: '2',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b047?w=100&h=100&fit=crop&crop=face',
        contentId: 'content-1',
        content: 'Love the new design direction! The color palette really captures our brand essence.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isResolved: false,
        replies: []
      },
      {
        id: 'comment-2',
        userId: '3',
        userName: 'Mike Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        contentId: 'content-1',
        content: 'Should we consider accessibility contrast ratios for the text?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isResolved: false,
        replies: []
      }
    ];

    this.comments.set('content-1', mockComments);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.currentUser) {
      this.emit('user_leave', { userId: this.currentUser.id });
    }

    this.isConnected = false;
    this.activeUsers.clear();
    this.comments.clear();
    this.liveEdits.clear();
    this.typingUsers.clear();
    this.cursors.clear();
    this.currentUser = null;
  }

  private handleConnectionError(): void {
    this.isConnected = false;
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        if (this.currentUser) {
          this.connect(this.currentUser);
        }
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  }

  updatePresence(location: string, cursor?: { x: number; y: number }): void {
    if (!this.currentUser || !this.isConnected) return;

    const presence = this.activeUsers.get(this.currentUser.id);
    if (presence) {
      presence.location = location;
      presence.lastSeen = new Date().toISOString();
      if (cursor) {
        presence.cursor = cursor;
      }
      
      this.activeUsers.set(this.currentUser.id, presence);
      this.emit('presence_update', { presence });
    }
  }

  updateCursor(x: number, y: number): void {
    if (!this.currentUser || !this.isConnected) return;

    const cursor: Cursor = {
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      color: this.activeUsers.get(this.currentUser.id)?.color || '#3B82F6',
      cursor: { x, y }
    };

    this.cursors.set(this.currentUser.id, cursor);
    this.emit('cursor_move', { cursor });
  }

  getActiveCursors(): Cursor[] {
    return Array.from(this.cursors.values())
      .filter(cursor => cursor.userId !== this.currentUser?.id);
  }

  addComment(contentId: string, content: string, position?: { x: number; y: number }): Comment | null {
    if (!this.currentUser || !this.isConnected) return null;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      contentId,
      content,
      timestamp: new Date().toISOString(),
      position,
      isResolved: false,
      replies: []
    };

    const contentComments = this.comments.get(contentId) || [];
    contentComments.push(comment);
    this.comments.set(contentId, contentComments);

    this.emit('comment_add', { comment });
    return comment;
  }

  replyToComment(commentId: string, content: string): Comment | null {
    if (!this.currentUser || !this.isConnected) return null;

    // Find the parent comment
    let parentComment: Comment | null = null;
    let contentId = '';

    for (const [cId, comments] of this.comments.entries()) {
      const found = comments.find(c => c.id === commentId);
      if (found) {
        parentComment = found;
        contentId = cId;
        break;
      }
    }

    if (!parentComment) return null;

    const reply: Comment = {
      id: `reply-${Date.now()}`,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      contentId,
      content,
      timestamp: new Date().toISOString(),
      isResolved: false,
      replies: [],
      parentId: commentId
    };

    parentComment.replies.push(reply);
    this.emit('comment_add', { comment: reply });
    return reply;
  }

  resolveComment(commentId: string): boolean {
    for (const comments of this.comments.values()) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.isResolved = true;
        this.emit('comment_resolve', { commentId });
        return true;
      }
    }
    return false;
  }

  startTyping(contentId: string): void {
    if (!this.currentUser || !this.isConnected) return;

    const users = this.typingUsers.get(contentId) || new Set();
    users.add(this.currentUser.id);
    this.typingUsers.set(contentId, users);

    this.emit('typing_start', { userId: this.currentUser.id, contentId });

    // Auto-stop typing after 3 seconds
    setTimeout(() => {
      this.stopTyping(contentId);
    }, 3000);
  }

  stopTyping(contentId: string): void {
    if (!this.currentUser || !this.isConnected) return;

    const users = this.typingUsers.get(contentId);
    if (users) {
      users.delete(this.currentUser.id);
      if (users.size === 0) {
        this.typingUsers.delete(contentId);
      }
    }

    this.emit('typing_stop', { userId: this.currentUser.id, contentId });
  }

  getActiveUsers(location?: string): UserPresence[] {
    const users = Array.from(this.activeUsers.values());
    if (location) {
      return users.filter(user => user.location === location);
    }
    return users;
  }

  getUserPresence(userId: string): UserPresence | null {
    return this.activeUsers.get(userId) || null;
  }

  getComments(contentId: string): Comment[] {
    return this.comments.get(contentId) || [];
  }

  getLiveEdits(contentId: string): LiveEdit[] {
    return this.liveEdits.get(contentId) || [];
  }

  getTypingUsers(contentId: string): string[] {
    const users = this.typingUsers.get(contentId);
    return users ? Array.from(users) : [];
  }

  // Event system
  on(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event) || [];
    const filtered = listeners.filter(cb => cb !== callback);
    this.eventListeners.set(event, filtered);
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // Simulate activity for demo purposes
  simulateActivity(): void {
    if (!this.isConnected) return;

    // Simulate typing activity
    setInterval(() => {
      const users = Array.from(this.activeUsers.values())
        .filter(u => u.userId !== this.currentUser?.id);
      
      if (users.length > 0 && Math.random() > 0.8) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const contentId = `content-${Math.floor(Math.random() * 3) + 1}`;
        
        this.emit('typing_start', { userId: randomUser.userId, contentId });
        
        setTimeout(() => {
          this.emit('typing_stop', { userId: randomUser.userId, contentId });
        }, 2000);
      }
    }, 5000);

    // Simulate cursor movement for other users
    setInterval(() => {
      const users = Array.from(this.activeUsers.values())
        .filter(u => u.userId !== this.currentUser?.id);
      
      users.forEach(user => {
        if (Math.random() > 0.9) {
          const cursor: Cursor = {
            userId: user.userId,
            userName: user.userName,
            color: user.color,
            cursor: {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }
          };
          
          this.cursors.set(user.userId, cursor);
          this.emit('cursor_move', { cursor });
        }
      });
    }, 1000);
  }

  // Connection status
  getConnectionStatus(): { isConnected: boolean; reconnectAttempts: number } {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Analytics
  getCollaborationAnalytics() {
    return {
      activeUsers: this.activeUsers.size,
      totalComments: Array.from(this.comments.values()).reduce((sum, comments) => sum + comments.length, 0),
      totalEdits: Array.from(this.liveEdits.values()).reduce((sum, edits) => sum + edits.length, 0),
      currentlyTyping: Array.from(this.typingUsers.values()).reduce((sum, users) => sum + users.size, 0)
    };
  }
}

// Export singleton instance
export const collaborationService = new CollaborationService();
