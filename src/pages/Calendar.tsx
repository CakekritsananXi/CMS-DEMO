import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Grid3X3, List, Calendar as CalendarIcon, Filter, X, MoreHorizontal } from 'lucide-react';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ContentCard from '../components/calendar/ContentCard';

const Calendar = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNewContentModal, setShowNewContentModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newContentData, setNewContentData] = useState({
    title: '',
    description: '',
    type: 'blog',
    pillar: '',
    scheduledDate: '',
    scheduledTime: '09:00'
  });

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
    setNewContentData({
      title: '',
      description: '',
      type: 'blog',
      pillar: '',
      scheduledDate: '',
      scheduledTime: '09:00'
    });
  };

  const handleCreateContent = () => {
    if (!newContentData.title.trim()) {
      alert('Please enter a content title');
      return;
    }
    
    console.log('Creating content:', {
      ...newContentData,
      scheduledDateTime: `${newContentData.scheduledDate} ${newContentData.scheduledTime}`
    });
    
    // Here you would typically save to your state management or API
    alert('Content scheduled successfully!');
    handleCloseModal();
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Editorial Calendar</h1>
          <p className="text-sm sm:text-base text-neutral-600">Plan, schedule, and organize your content strategy</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button className="px-3 sm:px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
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
        />
      </div>

      {/* Content Quick Add */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <ContentCard
          title="Blog Post Draft"
          type="blog"
          status="draft"
          dueDate="Tomorrow"
          pillar="Thought Leadership"
        />
        <ContentCard
          title="Social Media Series"
          type="social"
          status="scheduled"
          dueDate="This week"
          pillar="Community Building"
        />
        <ContentCard
          title="Newsletter Template"
          type="email"
          status="review"
          dueDate="Friday"
          pillar="Product Education"
        />
      </div>
      </div>

      {/* Click outside to close date picker */}
      {showDatePicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDatePicker(false)}
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
              <input
                type="text"
                value={newContentData.title}
                onChange={(e) => setNewContentData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Content title..."
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                autoFocus
              />
              
              <textarea
                value={newContentData.description}
                onChange={(e) => setNewContentData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Content description..."
                rows={4}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200 resize-none"
              />
              
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
                    Content Pillar
                  </label>
                  <select
                    value={newContentData.pillar}
                    onChange={(e) => setNewContentData(prev => ({ ...prev, pillar: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  >
                    <option value="">Select pillar...</option>
                    <option value="Thought Leadership">Thought Leadership</option>
                    <option value="Product Education">Product Education</option>
                    <option value="Industry Insights">Industry Insights</option>
                    <option value="Community Building">Community Building</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={newContentData.scheduledDate}
                    onChange={(e) => setNewContentData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
                  />
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
              
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-6 py-3 border border-neutral-200 rounded-xl font-medium text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContent}
                  className="w-full sm:w-auto bg-sage text-white px-6 py-3 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200"
                >
                  Schedule Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
