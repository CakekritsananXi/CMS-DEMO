// Database service layer for content management system
// This will integrate with Neon PostgreSQL once connected

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'contributor';
  avatar?: string;
  createdAt: string;
  lastActive: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'blog' | 'social' | 'email' | 'video' | 'podcast';
  status: 'draft' | 'in-progress' | 'review' | 'approved' | 'scheduled' | 'published';
  scheduledDate?: string;
  scheduledTime?: string;
  pillar: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  analytics?: ContentAnalytics;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'new' | 'developing' | 'approved' | 'rejected' | 'converted';
  priority: 'low' | 'medium' | 'high';
  authorId: string;
  assignedTo?: string;
  tags: string[];
  votes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  reactions: Reaction[];
}

export interface Reaction {
  userId: string;
  type: 'like' | 'love' | 'laugh' | 'insightful';
}

export interface ContentAnalytics {
  views: number;
  engagement: number;
  shares: number;
  comments: number;
  clickThrough: number;
  conversionRate: number;
  seoScore: number;
  readingTime: number;
}

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  conditions: object;
  actions: object;
  isActive: boolean;
  createdAt: string;
}

// Database service class
export class DatabaseService {
  private isConnected = false;
  
  // Mock data for development (replace with real DB calls)
  private mockUsers: User[] = [
    {
      id: 'user-1',
      email: 'sarah@company.com',
      name: 'Sarah Wilson',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    },
    {
      id: 'user-2',
      email: 'john@company.com',
      name: 'John Doe',
      role: 'editor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: new Date().toISOString(),
      lastActive: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'user-3',
      email: 'jane@company.com',
      name: 'Jane Smith',
      role: 'contributor',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      createdAt: new Date().toISOString(),
      lastActive: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  private mockIdeas: Idea[] = [
    {
      id: 'idea-1',
      title: 'AI-Powered Content Recommendations',
      description: 'Implement machine learning to suggest content topics based on trending keywords and audience engagement patterns.',
      category: 'Technology',
      status: 'developing',
      priority: 'high',
      authorId: 'user-1',
      assignedTo: 'user-2',
      tags: ['ai', 'automation', 'content-strategy'],
      votes: 12,
      comments: [],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'idea-2',
      title: 'Interactive Video Content Series',
      description: 'Create a series of interactive video tutorials that guide users through complex topics with clickable elements.',
      category: 'Video',
      status: 'new',
      priority: 'medium',
      authorId: 'user-2',
      tags: ['video', 'interactive', 'education'],
      votes: 8,
      comments: [],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  // Connection methods
  async connect(): Promise<boolean> {
    try {
      // In real implementation, this would connect to Neon/Supabase
      console.log('Connecting to database...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  isConnectionHealthy(): boolean {
    return this.isConnected;
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return this.mockUsers;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.mockUsers.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.mockUsers.push(newUser);
    return newUser;
  }

  // Content methods
  async getContentItems(): Promise<ContentItem[]> {
    // Return mock content for now
    return [];
  }

  async createContentItem(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
    const newContent: ContentItem = {
      ...content,
      id: `content-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newContent;
  }

  async updateContentItem(id: string, updates: Partial<ContentItem>): Promise<ContentItem | null> {
    // Mock implementation
    return null;
  }

  async deleteContentItem(id: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  // Ideas methods
  async getIdeas(): Promise<Idea[]> {
    return this.mockIdeas;
  }

  async createIdea(ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'comments'>): Promise<Idea> {
    const newIdea: Idea = {
      ...ideaData,
      id: `idea-${Date.now()}`,
      votes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockIdeas.push(newIdea);
    return newIdea;
  }

  async updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | null> {
    const ideaIndex = this.mockIdeas.findIndex(idea => idea.id === id);
    if (ideaIndex !== -1) {
      this.mockIdeas[ideaIndex] = {
        ...this.mockIdeas[ideaIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.mockIdeas[ideaIndex];
    }
    return null;
  }

  async deleteIdea(id: string): Promise<boolean> {
    const initialLength = this.mockIdeas.length;
    this.mockIdeas = this.mockIdeas.filter(idea => idea.id !== id);
    return this.mockIdeas.length < initialLength;
  }

  // Analytics methods
  async getContentAnalytics(contentId: string): Promise<ContentAnalytics | null> {
    // Mock analytics data
    return {
      views: Math.floor(Math.random() * 10000),
      engagement: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 50),
      clickThrough: Math.floor(Math.random() * 20),
      conversionRate: Math.floor(Math.random() * 10),
      seoScore: Math.floor(Math.random() * 100),
      readingTime: Math.floor(Math.random() * 10) + 2
    };
  }

  // Workflow methods
  async getWorkflowRules(): Promise<WorkflowRule[]> {
    return [];
  }

  async createWorkflowRule(rule: Omit<WorkflowRule, 'id' | 'createdAt'>): Promise<WorkflowRule> {
    const newRule: WorkflowRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return newRule;
  }
}

// Export singleton instance
export const db = new DatabaseService();

// Database schema for Neon (SQL)
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'contributor',
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

-- Content items table
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_date DATE,
  scheduled_time TIME,
  pillar VARCHAR(255),
  priority VARCHAR(50) DEFAULT 'medium',
  assignee UUID REFERENCES users(id),
  author_id UUID REFERENCES users(id) NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(50) DEFAULT 'medium',
  author_id UUID REFERENCES users(id) NOT NULL,
  assigned_to UUID REFERENCES users(id),
  tags TEXT[],
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) NOT NULL,
  idea_id UUID REFERENCES ideas(id),
  content_id UUID REFERENCES content_items(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content_items(id) NOT NULL,
  views INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  click_through INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Workflow rules table
CREATE TABLE IF NOT EXISTS workflow_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(100) NOT NULL,
  conditions JSONB,
  actions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_author ON content_items(author_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_scheduled ON content_items(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_ideas_author ON ideas(author_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_comments_idea ON comments(idea_id);
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_id);
`;
