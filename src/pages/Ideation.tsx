import React, { useState, useEffect } from 'react';
import { Plus, Lightbulb, Tag, Filter, Search, Star, MessageSquare, Clock, User, TrendingUp, X, ChevronDown } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from '../contexts/AuthContext';
import { useCollaboration } from '../contexts/CollaborationContext';
import UserPresence from '../components/collaboration/UserPresence';
import TypingIndicator from '../components/collaboration/TypingIndicator';
import AISuggestions from '../components/ideation/AISuggestions';

interface NewIdeaData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

const Ideation = () => {
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newIdeaData, setNewIdeaData] = useState<NewIdeaData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const { ideas, createIdea, updateIdea, deleteIdea, voteOnIdea } = useDatabase();
  const { user } = useAuth();
  const { addComment, getCommentsForContent } = useCollaboration();

  // Filter ideas based on search and filters
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || idea.category === selectedCategory;
    const matchesStatus = !selectedStatus || idea.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories from ideas
  const categories = Array.from(new Set(ideas.map(idea => idea.category).filter(Boolean)));

  // Calculate stats
  const stats = {
    total: ideas.length,
    categories: categories.length,
    thisWeek: ideas.filter(idea => {
      const ideaDate = new Date(idea.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return ideaDate >= weekAgo;
    }).length,
    highPriority: ideas.filter(idea => idea.priority === 'high').length
  };

  const handleCreateIdea = async () => {
    if (!user || !newIdeaData.title.trim()) return;

    try {
      await createIdea({
        ...newIdeaData,
        authorId: user.id,
        status: 'new'
      });
      
      // Reset form
      setNewIdeaData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        tags: []
      });
      setTagInput('');
      setShowNewIdeaModal(false);
    } catch (error) {
      console.error('Failed to create idea:', error);
    }
  };

  const handleAISuggestionSelect = (suggestion: any) => {
    setNewIdeaData({
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      priority: suggestion.confidence >= 0.9 ? 'high' : suggestion.confidence >= 0.8 ? 'medium' : 'low',
      tags: [suggestion.category.toLowerCase(), 'ai-suggested']
    });
    setShowNewIdeaModal(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newIdeaData.tags.includes(tagInput.trim())) {
      setNewIdeaData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewIdeaData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'developing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'converted': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Content Ideation</h1>
          <p className="text-sm sm:text-base text-neutral-600">Capture, organize, and develop your content ideas</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <UserPresence location="/ideation" showDetails />
          
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 sm:px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
                {(selectedCategory || selectedStatus) && (
                  <span className="bg-sage text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {[selectedCategory, selectedStatus].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
            
            <button 
              onClick={() => setShowNewIdeaModal(true)}
              className="bg-sage text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 shadow-soft text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Idea</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ideas..."
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-xl border border-neutral-200 p-4 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="developing">Developing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedStatus('');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sage/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-sage" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">{stats.total}</div>
              <div className="text-xs sm:text-sm text-neutral-600">Total Ideas</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warm-blue/10 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-warm-blue" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">{stats.categories}</div>
              <div className="text-xs sm:text-sm text-neutral-600">Categories</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warm-amber/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-warm-amber" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">{stats.thisWeek}</div>
              <div className="text-xs sm:text-sm text-neutral-600">This Week</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-soft border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted-rose/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-muted-rose" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-900">{stats.highPriority}</div>
              <div className="text-xs sm:text-sm text-neutral-600">High Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* AI Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <AISuggestions onSuggestionSelect={handleAISuggestionSelect} />
        </div>

        {/* Ideas Grid */}
        <div className="lg:col-span-3">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No ideas found</h3>
              <p className="text-neutral-600 mb-4">
                {searchTerm || selectedCategory || selectedStatus 
                  ? 'Try adjusting your filters or search term'
                  : 'Get started by creating your first idea'
                }
              </p>
              <button
                onClick={() => setShowNewIdeaModal(true)}
                className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200"
              >
                Create New Idea
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-250 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">{idea.title}</h3>
                      <p className="text-sm text-neutral-600 line-clamp-3 mb-3">{idea.description}</p>
                    </div>
                    <button 
                      onClick={() => voteOnIdea(idea.id, true)}
                      className="flex items-center space-x-1 text-sm text-neutral-500 hover:text-sage transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      <span>{idea.votes}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(idea.status)}`}>
                      {idea.status}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(idea.priority)}`}>
                      {idea.priority} priority
                    </span>
                  </div>

                  {idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {idea.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-lg">
                          {tag}
                        </span>
                      ))}
                      {idea.tags.length > 3 && (
                        <span className="text-xs text-neutral-500">+{idea.tags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{idea.authorId}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{idea.comments.length}</span>
                    </div>
                  </div>

                  <TypingIndicator contentId={idea.id} className="mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Idea Modal */}
      {showNewIdeaModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Create New Idea</h2>
              <button
                onClick={() => setShowNewIdeaModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newIdeaData.title}
                  onChange={(e) => setNewIdeaData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your idea title..."
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  value={newIdeaData.description}
                  onChange={(e) => setNewIdeaData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your idea in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={newIdeaData.category}
                    onChange={(e) => setNewIdeaData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. Technology, Marketing"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Priority</label>
                  <select
                    value={newIdeaData.priority}
                    onChange={(e) => setNewIdeaData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newIdeaData.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-sage/10 text-sage rounded-lg text-sm flex items-center space-x-1">
                      <span>{tag}</span>
                      <button onClick={() => handleRemoveTag(tag)} className="text-sage/70 hover:text-sage">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add tags..."
                    className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowNewIdeaModal(false)}
                  className="px-6 py-3 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateIdea}
                  disabled={!newIdeaData.title.trim()}
                  className="bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Idea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close filters */}
      {showFilters && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default Ideation;
