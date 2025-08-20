// Real-time collaboration service
// In production, this would use WebSockets or a service like Socket.io

export interface UserPresence {
  userId: string;
  userName: string;
  userAvatar?: string;
  location: string; // page/section where user is active
  lastSeen: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  color: string; // unique color for this user
}

export interface CollaborationEvent {
  id: string;
  type: 'user_join' | 'user_leave' | 'content_edit' | 'cursor_move' | 'comment_add';
  userId: string;
  timestamp: string;
  data: any;
}

export interface LiveEdit {
  id: string;
  contentId: string;
  userId: string;
  operation: 'insert' | 'delete' | 'replace';
  position: number;
  content: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  position?: { x: number; y: number };
  timestamp: string;
  replies: Comment[];
  isResolved: boolean;
}

// User colors for collaboration
const USER_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#84CC16', '#22C55E', '#10B981', '#14B8A6',
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
];

export class CollaborationService {
  private presenceData: Map<string, UserPresence> = new Map();
  private comments: Map<string, Comment[]> = new Map();
  private liveEdits: Map<string, LiveEdit[]> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();
  private currentUser: { id: string; name: string; avatar?: string } | null = null;
  private isConnected = false;

  // Mock WebSocket simulation
  private mockEvents: CollaborationEvent[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Simulate some active users
    const mockUsers = [
      { id: 'user-2', name: 'John Editor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
      { id: 'user-3', name: 'Jane Contributor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50' }
    ];

    mockUsers.forEach((user, index) => {
      this.presenceData.set(user.id, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        location: index === 0 ? '/calendar' : '/ideation',
        lastSeen: new Date(Date.now() - Math.random() * 300000).toISOString(),
        isOnline: Math.random() > 0.3,
        color: USER_COLORS[index % USER_COLORS.length]
      });
    });

    // Mock comments
    this.comments.set('content-1', [
      {
        id: 'comment-1',
        contentId: 'content-1',
        userId: 'user-2',
        userName: 'John Editor',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
        content: 'This looks great! Should we add more details about the target audience?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        replies: [],
        isResolved: false
      }
    ]);
  }

  // Connection management
  async connect(user: { id: string; name: string; avatar?: string }): Promise<boolean> {
    this.currentUser = user;
    this.isConnected = true;

    // Add current user to presence
    this.presenceData.set(user.id, {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      location: window.location.pathname,
      lastSeen: new Date().toISOString(),
      isOnline: true,
      color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
    });

    this.emit('user_join', { user });
    return true;
  }

  disconnect(): void {
    if (this.currentUser) {
      const presence = this.presenceData.get(this.currentUser.id);
      if (presence) {
        presence.isOnline = false;
        presence.lastSeen = new Date().toISOString();
      }
      this.emit('user_leave', { userId: this.currentUser.id });
    }
    this.isConnected = false;
    this.currentUser = null;
  }

  // Presence tracking
  updatePresence(location: string, cursor?: { x: number; y: number }): void {
    if (!this.currentUser) return;

    const presence = this.presenceData.get(this.currentUser.id);
    if (presence) {
      presence.location = location;
      presence.lastSeen = new Date().toISOString();
      presence.cursor = cursor;
      this.emit('presence_update', { userId: this.currentUser.id, location, cursor });
    }
  }

  getActiveUsers(location?: string): UserPresence[] {
    const users = Array.from(this.presenceData.values());
    return users.filter(user => {
      if (!user.isOnline) return false;
      if (location && user.location !== location) return false;
      return true;
    });
  }

  getUserPresence(userId: string): UserPresence | null {
    return this.presenceData.get(userId) || null;
  }

  // Live editing
  sendEdit(contentId: string, operation: LiveEdit['operation'], position: number, content: string): void {
    if (!this.currentUser) return;

    const edit: LiveEdit = {
      id: `edit-${Date.now()}`,
      contentId,
      userId: this.currentUser.id,
      operation,
      position,
      content,
      timestamp: new Date().toISOString()
    };

    if (!this.liveEdits.has(contentId)) {
      this.liveEdits.set(contentId, []);
    }
    this.liveEdits.get(contentId)!.push(edit);

    this.emit('content_edit', edit);
  }

  getLiveEdits(contentId: string): LiveEdit[] {
    return this.liveEdits.get(contentId) || [];
  }

  // Comments
  addComment(contentId: string, content: string, position?: { x: number; y: number }): Comment | null {
    if (!this.currentUser) return null;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      contentId,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      content,
      position,
      timestamp: new Date().toISOString(),
      replies: [],
      isResolved: false
    };

    if (!this.comments.has(contentId)) {
      this.comments.set(contentId, []);
    }
    this.comments.get(contentId)!.push(comment);

    this.emit('comment_add', comment);
    return comment;
  }

  replyToComment(commentId: string, content: string): Comment | null {
    if (!this.currentUser) return null;

    const reply: Comment = {
      id: `reply-${Date.now()}`,
      contentId: '',
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      replies: [],
      isResolved: false
    };

    // Find the parent comment and add reply
    for (const [contentId, comments] of this.comments) {
      const parentComment = comments.find(c => c.id === commentId);
      if (parentComment) {
        parentComment.replies.push(reply);
        this.emit('comment_reply', { commentId, reply });
        return reply;
      }
    }

    return null;
  }

  resolveComment(commentId: string): boolean {
    for (const [contentId, comments] of this.comments) {
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.isResolved = true;
        this.emit('comment_resolve', { commentId });
        return true;
      }
    }
    return false;
  }

  getComments(contentId: string): Comment[] {
    return this.comments.get(contentId) || [];
  }

  // Event handling
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  // Cursor tracking
  updateCursor(x: number, y: number): void {
    if (!this.currentUser) return;

    const presence = this.presenceData.get(this.currentUser.id);
    if (presence) {
      presence.cursor = { x, y };
      this.emit('cursor_move', { userId: this.currentUser.id, cursor: { x, y } });
    }
  }

  getActiveCursors(): Array<{ userId: string; userName: string; color: string; cursor: { x: number; y: number } }> {
    const users = Array.from(this.presenceData.values());
    return users
      .filter(user => user.isOnline && user.cursor && user.userId !== this.currentUser?.id)
      .map(user => ({
        userId: user.userId,
        userName: user.userName,
        color: user.color,
        cursor: user.cursor!
      }));
  }

  // Typing indicators
  startTyping(contentId: string): void {
    if (!this.currentUser) return;
    this.emit('typing_start', { userId: this.currentUser.id, contentId });
  }

  stopTyping(contentId: string): void {
    if (!this.currentUser) return;
    this.emit('typing_stop', { userId: this.currentUser.id, contentId });
  }

  // Connection status
  isConnectionHealthy(): boolean {
    return this.isConnected;
  }

  // Mock real-time updates (simulate network activity)
  simulateActivity(): void {
    setInterval(() => {
      if (!this.isConnected) return;

      // Simulate random user activity
      const users = Array.from(this.presenceData.values());
      const activeUsers = users.filter(u => u.isOnline);
      
      if (activeUsers.length > 0) {
        const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        
        // Simulate cursor movement
        if (Math.random() > 0.7) {
          randomUser.cursor = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          };
          this.emit('cursor_move', { 
            userId: randomUser.userId, 
            cursor: randomUser.cursor 
          });
        }

        // Simulate typing
        if (Math.random() > 0.9) {
          this.emit('typing_start', { 
            userId: randomUser.userId, 
            contentId: 'content-' + Math.floor(Math.random() * 3 + 1)
          });
          
          setTimeout(() => {
            this.emit('typing_stop', { 
              userId: randomUser.userId, 
              contentId: 'content-' + Math.floor(Math.random() * 3 + 1)
            });
          }, 2000 + Math.random() * 3000);
        }
      }
    }, 2000);
  }
}

// Export singleton instance
export const collaborationService = new CollaborationService();
