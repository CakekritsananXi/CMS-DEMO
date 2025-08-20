import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Grid3X3, List, Calendar as CalendarIcon, Filter, X, MoreHorizontal } from 'lucide-react';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ContentCard from '../components/calendar/ContentCard';

const Calendar = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNewContentModal, setShowNewContentModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    assignee: '',
    pillar: '',
    priority: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newContentData, setNewContentData] = useState({
    title: '',
    description: '',
    type: 'blog',
    pillar: '',
    scheduledDate: '',
    scheduledTime: '09:00',
    priority: 'medium',
    assignee: '',
    tags: [],
    status: 'draft'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isCreating, setIsCreating] = useState(false);
  const [contentItems, setContentItems] = useState([
    {
      id: '1',
      title: 'Blog Post Draft',
      type: 'blog' as const,
      status: 'draft' as const,
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: '14:00',
      pillar: 'Thought Leadership',
      description: 'Introduction to our new product features',
      priority: 'medium',
      assignee: 'john-doe'
    },
    {
      id: '2',
      title: 'Social Media Series',
      type: 'social' as const,
      status: 'scheduled' as const,
      scheduledDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      scheduledTime: '10:00',
      pillar: 'Community Building',
      description: 'Weekly social media content series',
      priority: 'high',
      assignee: 'jane-smith'
    },
    {
      id: '3',
      title: 'Newsletter Template',
      type: 'email' as const,
      status: 'review' as const,
      scheduledDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      scheduledTime: '09:00',
      pillar: 'Product Education',
      description: 'Monthly newsletter template',
      priority: 'medium',
      assignee: 'mike-johnson'
    }
  ]);

  const viewButtons = [
    { key: 'month', label: 'Month', icon: Grid3X3 },
    { key: 'week', label: 'Week', icon: List },
    { key: 'day', label: 'Day', icon: CalendarIcon },
  ];

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      switch (view) {
        case 'month':
          return direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1);
        case 'week':
          return direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1);
        case 'day':
          return direction === 'next' ? addDays(prev, 1) : subDays(prev, 1);
        default:
          return prev;
      }
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToDate = (date: Date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
  };

  const getNavigationLabel = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  const currentYear = currentDate.getFullYear();
  const months = eachMonthOfInterval({
    start: startOfYear(currentDate),
    end: endOfYear(currentDate)
  });

  const getFilteredContent = () => {
    return contentItems.filter(item => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.assignee && item.assignee !== filters.assignee) return false;
      if (filters.pillar && item.pillar !== filters.pillar) return false;
      if (filters.priority && item.priority !== filters.priority) return false;
      return true;
    });
  };

  const handleOpenNewContentModal = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setNewContentData(prev => ({
        ...prev,
        scheduledDate: format(date, 'yyyy-MM-dd')
      }));
    } else {
      setSelectedDate(null);
      setNewContentData(prev => ({
        ...prev,
        scheduledDate: format(new Date(), 'yyyy-MM-dd')
      }));
    }
    setShowNewContentModal(true);
  };

  const handleCloseModal = () => {
    setShowNewContentModal(false);
    setSelectedDate(null);
    setErrors({});
    setNewContentData({
      title: '',
      description: '',
      type: 'blog',
      pillar: '',
      scheduledDate: '',
      scheduledTime: '09:00',
      priority: 'medium',
      assignee: '',
      tags: [],
      status: 'draft'
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!newContentData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!newContentData.scheduledDate) {
      newErrors.scheduledDate = 'Date is required';
    }

    if (!newContentData.pillar) {
      newErrors.pillar = 'Content pillar is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateContent = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newContent = {
        ...newContentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      setContentItems(prev => [...prev, newContent]);
      console.log('Creating content:', newContent);

      alert('Content scheduled successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create content. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Editorial Calendar</h1>
          <p className="text-sm sm:text-base text-neutral-600">Plan, schedule, and organize your content strategy</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 sm:px-4 py-2 border rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base ${
                Object.values(filters).some(f => f !== '')
                  ? 'border-sage bg-sage/10 text-sage'
                  : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {Object.values(filters).some(f => f !== '') && (
                <span className="bg-sage text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(f => f !== '').length}
                </span>
              )}
            </button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg p-4 z-50 min-w-[320px]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                    >
                      <option value="">All Types</option>
                      <option value="blog">Blog Post</option>
                      <option value="social">Social Media</option>
                      <option value="email">Email/Newsletter</option>
                      <option value="video">Video</option>
                      <option value="podcast">Podcast</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                    >
                      <option value="">All Statuses</option>
                      <option value="draft">Draft</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Assignee
                    </label>
                    <select
                      value={filters.assignee}
                      onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                    >
                      <option value="">All Assignees</option>
                      <option value="john-doe">John Doe</option>
                      <option value="jane-smith">Jane Smith</option>
                      <option value="mike-johnson">Mike Johnson</option>
                      <option value="sarah-wilson">Sarah Wilson</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Content Pillar
                    </label>
                    <select
                      value={filters.pillar}
                      onChange={(e) => setFilters(prev => ({ ...prev, pillar: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                    >
                      <option value="">All Pillars</option>
                      <option value="Thought Leadership">Thought Leadership</option>
                      <option value="Product Education">Product Education</option>
                      <option value="Industry Insights">Industry Insights</option>
                      <option value="Community Building">Community Building</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                    >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <button
                      onClick={() => setFilters({ type: '', status: '', assignee: '', pillar: '', priority: '' })}
                      className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-sage text-white rounded-lg text-sm font-medium hover:bg-sage/90 transition-colors duration-200"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => handleOpenNewContentModal()}
            className="bg-sage text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 shadow-soft text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Content</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-soft border border-neutral-100 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('prev')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                title={`Previous ${view}`}
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="text-lg sm:text-xl font-semibold text-neutral-900 min-w-[160px] sm:min-w-[240px] text-center hover:bg-neutral-50 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>{getNavigationLabel()}</span>
                  <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                </button>

                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg p-4 z-50 min-w-[280px]">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <button
                          onClick={() => setCurrentDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate()))}
                          className="p-1 hover:bg-neutral-100 rounded"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-semibold">{currentYear}</span>
                        <button
                          onClick={() => setCurrentDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate()))}
                          className="p-1 hover:bg-neutral-100 rounded"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {months.map((month) => (
                          <button
                            key={month.getTime()}
                            onClick={() => goToDate(month)}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              month.getMonth() === currentDate.getMonth()
                                ? 'bg-sage text-white'
                                : 'hover:bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {format(month, 'MMM')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                      <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-sage text-white rounded-lg text-sm font-medium hover:bg-sage/90 transition-colors duration-200"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('next')}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
                title={`Next ${view}`}
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors duration-200 hidden sm:block"
            >
              Today
            </button>
          </div>

          <div className="flex bg-neutral-100 rounded-xl p-1">
            {viewButtons.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key as any)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  view === key
                    ? 'bg-white text-sage shadow-soft'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden">
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          onDateClick={handleOpenNewContentModal}
          contentItems={getFilteredContent()}
          onContentMove={(contentId, newDate) => {
            setContentItems(prev => prev.map(item =>
              item.id === contentId
                ? { ...item, scheduledDate: format(newDate, 'yyyy-MM-dd') }
                : item
            ));
          }}
          onContentEdit={(contentId) => {
            const content = contentItems.find(item => item.id === contentId);
            if (content) {
              setNewContentData(content);
              setShowNewContentModal(true);
            }
          }}
          onContentDelete={(contentId) => {
            if (confirm('Are you sure you want to delete this content?')) {
              setContentItems(prev => prev.filter(item => item.id !== contentId));
            }
          }}
          onContentDuplicate={(contentId) => {
            const content = contentItems.find(item => item.id === contentId);
            if (content) {
              const duplicatedContent = {
                ...content,
                id: Date.now().toString(),
                title: `${content.title} (Copy)`,
                status: 'draft' as const,
                scheduledDate: format(addDays(new Date(content.scheduledDate), 1), 'yyyy-MM-dd')
              };
              setContentItems(prev => [...prev, duplicatedContent]);
            }
          }}
        />
      </div>

      {/* Content Quick Add */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Unscheduled Content</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {getFilteredContent()
            .filter(item => !item.scheduledDate || new Date(item.scheduledDate) < new Date())
            .map(item => (
              <ContentCard
                key={item.id}
                id={item.id}
                title={item.title}
                type={item.type}
                status={item.status}
                dueDate={item.scheduledDate ? format(new Date(item.scheduledDate), 'MMM d') : 'Not scheduled'}
                pillar={item.pillar}
                onEdit={() => {
                  setNewContentData(item);
                  setShowNewContentModal(true);
                }}
                onDelete={() => {
                  if (confirm('Are you sure you want to delete this content?')) {
                    setContentItems(prev => prev.filter(i => i.id !== item.id));
                  }
                }}
                onDuplicate={() => {
                  const duplicatedContent = {
                    ...item,
                    id: Date.now().toString(),
                    title: `${item.title} (Copy)`,
                    status: 'draft' as const,
                    scheduledDate: format(addDays(new Date(), 1), 'yyyy-MM-dd')
                  };
                  setContentItems(prev => [...prev, duplicatedContent]);
                }}
              />
            ))
          }
        </div>
      </div>
      </div>

      {/* Click outside to close overlays */}
      {(showDatePicker || showFilters) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDatePicker(false);
            setShowFilters(false);
          }}
        />
      )}

      {/* New Content Modal */}
      {showNewContentModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-2xl shadow-xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Create New Content</h2>
                {selectedDate && (
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                    Scheduling for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <input
                  type="text"
                  value={newContentData.title}
                  onChange={(e) => {
                    setNewContentData(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  placeholder="Content title..."
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 ${
                    errors.title ? 'border-red-300' : 'border-neutral-200'
                  }`}
                  autoFocus
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              
              <div>
                <textarea
                  value={newContentData.description}
                  onChange={(e) => setNewContentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Content description..."
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={newContentData.type}
                    onChange={(e) => setNewContentData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  >
                    <option value="blog">Blog Post</option>
                    <option value="social">Social Media</option>
                    <option value="email">Email/Newsletter</option>
                    <option value="video">Video</option>
                    <option value="podcast">Podcast</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Content Pillar *
                  </label>
                  <select
                    value={newContentData.pillar}
                    onChange={(e) => {
                      setNewContentData(prev => ({ ...prev, pillar: e.target.value }));
                      if (errors.pillar) setErrors(prev => ({ ...prev, pillar: '' }));
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 ${
                      errors.pillar ? 'border-red-300' : 'border-neutral-200'
                    }`}
                  >
                    <option value="">Select pillar...</option>
                    <option value="Thought Leadership">Thought Leadership</option>
                    <option value="Product Education">Product Education</option>
                    <option value="Industry Insights">Industry Insights</option>
                    <option value="Community Building">Community Building</option>
                  </select>
                  {errors.pillar && (
                    <p className="text-red-500 text-sm mt-1">{errors.pillar}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={newContentData.scheduledDate}
                    onChange={(e) => {
                      setNewContentData(prev => ({ ...prev, scheduledDate: e.target.value }));
                      if (errors.scheduledDate) setErrors(prev => ({ ...prev, scheduledDate: '' }));
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 ${
                      errors.scheduledDate ? 'border-red-300' : 'border-neutral-200'
                    }`}
                  />
                  {errors.scheduledDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={newContentData.scheduledTime}
                    onChange={(e) => setNewContentData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newContentData.priority}
                    onChange={(e) => setNewContentData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newContentData.status}
                    onChange={(e) => setNewContentData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  >
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Assignee
                </label>
                <select
                  value={newContentData.assignee}
                  onChange={(e) => setNewContentData(prev => ({ ...prev, assignee: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                >
                  <option value="">Assign to...</option>
                  <option value="john-doe">John Doe</option>
                  <option value="jane-smith">Jane Smith</option>
                  <option value="mike-johnson">Mike Johnson</option>
                  <option value="sarah-wilson">Sarah Wilson</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-6 py-3 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContent}
                  disabled={isCreating}
                  className="w-full sm:w-auto bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Schedule Content</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default Calendar;
