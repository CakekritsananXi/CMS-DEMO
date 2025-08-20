import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, User, ContentItem, Idea, DatabaseService } from '../services/database';

interface DatabaseContextType {
  // Connection state
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Users
  users: User[];
  currentUser: User | null;
  
  // Content
  contentItems: ContentItem[];
  
  // Ideas
  ideas: Idea[];
  
  // Methods
  connect: () => Promise<boolean>;
  disconnect: () => void;
  refreshData: () => Promise<void>;
  
  // User methods
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  setCurrentUser: (user: User) => void;
  
  // Content methods
  createContent: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ContentItem>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<ContentItem | null>;
  deleteContent: (id: string) => Promise<boolean>;
  
  // Idea methods
  createIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'comments'>) => Promise<Idea>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<Idea | null>;
  deleteIdea: (id: string) => Promise<boolean>;
  voteOnIdea: (ideaId: string, increment: boolean) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Initialize database connection
  useEffect(() => {
    const initDatabase = async () => {
      setIsLoading(true);
      try {
        const connected = await db.connect();
        setIsConnected(connected);
        
        if (connected) {
          await refreshData();
          // Set default current user (in real app, this would come from auth)
          const allUsers = await db.getUsers();
          if (allUsers.length > 0) {
            setCurrentUser(allUsers[0]); // Default to first user
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Database connection failed');
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, []);

  const connect = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const connected = await db.connect();
      setIsConnected(connected);
      if (connected) {
        await refreshData();
      }
      return connected;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setUsers([]);
    setContentItems([]);
    setIdeas([]);
    setCurrentUser(null);
  };

  const refreshData = async () => {
    try {
      const [usersData, contentData, ideasData] = await Promise.all([
        db.getUsers(),
        db.getContentItems(),
        db.getIdeas()
      ]);
      
      setUsers(usersData);
      setContentItems(contentData);
      setIdeas(ideasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    }
  };

  // User methods
  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser = await db.createUser(userData);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
  };

  // Content methods
  const createContent = async (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> => {
    const newContent = await db.createContentItem(content);
    setContentItems(prev => [...prev, newContent]);
    return newContent;
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>): Promise<ContentItem | null> => {
    const updated = await db.updateContentItem(id, updates);
    if (updated) {
      setContentItems(prev => prev.map(item => item.id === id ? updated : item));
    }
    return updated;
  };

  const deleteContent = async (id: string): Promise<boolean> => {
    const success = await db.deleteContentItem(id);
    if (success) {
      setContentItems(prev => prev.filter(item => item.id !== id));
    }
    return success;
  };

  // Idea methods
  const createIdea = async (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'comments'>): Promise<Idea> => {
    const newIdea = await db.createIdea(idea);
    setIdeas(prev => [...prev, newIdea]);
    return newIdea;
  };

  const updateIdea = async (id: string, updates: Partial<Idea>): Promise<Idea | null> => {
    const updated = await db.updateIdea(id, updates);
    if (updated) {
      setIdeas(prev => prev.map(item => item.id === id ? updated : item));
    }
    return updated;
  };

  const deleteIdea = async (id: string): Promise<boolean> => {
    const success = await db.deleteIdea(id);
    if (success) {
      setIdeas(prev => prev.filter(item => item.id !== id));
    }
    return success;
  };

  const voteOnIdea = async (ideaId: string, increment: boolean): Promise<void> => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      const newVotes = increment ? idea.votes + 1 : Math.max(0, idea.votes - 1);
      await updateIdea(ideaId, { votes: newVotes });
    }
  };

  const value: DatabaseContextType = {
    // State
    isConnected,
    isLoading,
    error,
    users,
    currentUser,
    contentItems,
    ideas,
    
    // Methods
    connect,
    disconnect,
    refreshData,
    createUser,
    setCurrentUser: handleSetCurrentUser,
    createContent,
    updateContent,
    deleteContent,
    createIdea,
    updateIdea,
    deleteIdea,
    voteOnIdea
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

// Hook for connection status
export const useConnectionStatus = () => {
  const { isConnected, isLoading, error } = useDatabase();
  return { isConnected, isLoading, error };
};

// Hook for current user
export const useCurrentUser = () => {
  const { currentUser, setCurrentUser } = useDatabase();
  return { currentUser, setCurrentUser };
};

// Hook for content management
export const useContent = () => {
  const { 
    contentItems, 
    createContent, 
    updateContent, 
    deleteContent 
  } = useDatabase();
  return { 
    contentItems, 
    createContent, 
    updateContent, 
    deleteContent 
  };
};

// Hook for idea management
export const useIdeas = () => {
  const { 
    ideas, 
    createIdea, 
    updateIdea, 
    deleteIdea, 
    voteOnIdea 
  } = useDatabase();
  return { 
    ideas, 
    createIdea, 
    updateIdea, 
    deleteIdea, 
    voteOnIdea 
  };
};
