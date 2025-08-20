import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'email' | 'video' | 'podcast';
  status: 'draft' | 'scheduled' | 'review' | 'in-progress' | 'approved' | 'published';
  scheduledDate: string;
  scheduledTime: string;
  pillar: string;
  description?: string;
  priority?: string;
  assignee?: string;
}

interface CalendarGridProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  onDateClick?: (date: Date) => void;
  contentItems?: ContentItem[];
  onContentMove?: (contentId: string, newDate: Date) => void;
  onContentEdit?: (contentId: string) => void;
  onContentDelete?: (contentId: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  view,
  currentDate,
  onDateClick,
  contentItems = [],
  onContentMove,
  onContentEdit,
  onContentDelete
}) => {
  const getContentForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return contentItems.filter(item => item.scheduledDate === dateStr);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(currentDate);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (view === 'month') {
    return (
      <div className="p-3 sm:p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4">
          {weekdays.map((day) => (
            <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-neutral-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <CalendarDay
                key={index}
                date={day}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                onDateClick={onDateClick}
                contentItems={getContentForDate(day)}
                onContentDrop={(content) => {
                  if (onContentMove) {
                    onContentMove(content.id, day);
                  }
                }}
                onContentEdit={onContentEdit}
                onContentDelete={onContentDelete}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'week') {
    return (
      <div className="p-3 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-8 gap-1">
          <div className="p-3"></div>
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="p-3 text-center">
              <div className="text-sm font-medium text-neutral-900">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-semibold mt-1 ${
                day.toDateString() === new Date().toDateString() 
                  ? 'text-sage' 
                  : 'text-neutral-700'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
          
          {Array.from({ length: 24 }, (_, hour) => (
            <React.Fragment key={hour}>
              <div className="p-2 text-xs text-neutral-500 text-right border-r border-neutral-100">
                {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
              </div>
              {weekDays.map((day) => (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-[60px] border border-neutral-100 hover:bg-neutral-50 transition-colors duration-200"
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'day') {
    return (
      <div className="p-3 sm:p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <div className="space-y-1">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="flex items-center">
                <div className="w-12 sm:w-16 text-xs text-neutral-500 text-right pr-2 sm:pr-4">
                  {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
                </div>
                <div className="flex-1 min-h-[40px] sm:min-h-[60px] border border-neutral-100 hover:bg-neutral-50 transition-colors duration-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="text-center text-neutral-500">
        View not implemented
      </div>
    </div>
  );
};

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  onDateClick?: (date: Date) => void;
  contentItems?: ContentItem[];
  onContentDrop?: (content: any) => void;
  onContentEdit?: (contentId: string) => void;
  onContentDelete?: (contentId: string) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isCurrentMonth,
  isToday,
  onDateClick,
  contentItems = [],
  onContentDrop,
  onContentEdit,
  onContentDelete
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['content', 'content-card'],
    drop: (item: any) => {
      console.log('Dropping item:', item, 'on date:', format(date, 'yyyy-MM-dd'));
      if (onContentDrop) {
        onContentDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-warm-blue/10 text-warm-blue border-warm-blue/20';
      case 'social':
        return 'bg-dusty-purple/10 text-dusty-purple border-dusty-purple/20';
      case 'email':
        return 'bg-warm-amber/10 text-warm-amber border-warm-amber/20';
      case 'video':
        return 'bg-muted-rose/10 text-muted-rose border-muted-rose/20';
      case 'podcast':
        return 'bg-soft-emerald/10 text-soft-emerald border-soft-emerald/20';
      default:
        return 'bg-sage/10 text-sage border-sage/20';
    }
  };

  return (
    <div
      ref={drop}
      onClick={() => onDateClick && onDateClick(date)}
      className={`min-h-[80px] sm:min-h-[120px] p-2 sm:p-3 border border-neutral-100 transition-all duration-200 ${
        isCurrentMonth ? 'bg-white' : 'bg-neutral-50'
      } ${
        isOver ? 'bg-sage/5 border-sage/30' : ''
      } hover:bg-neutral-50 cursor-pointer ${
        onDateClick ? 'hover:border-sage/30' : ''
      }`}
    >
      <div className={`text-sm font-medium mb-2 ${
        isToday 
          ? 'w-5 h-5 sm:w-6 sm:h-6 bg-sage text-white rounded-full flex items-center justify-center text-xs'
          : isCurrentMonth 
            ? 'text-neutral-900' 
            : 'text-neutral-400'
      }`}>
        {date.getDate()}
      </div>

      <div className="space-y-1">
        {contentItems.map((item) => (
          <div
            key={item.id}
            className={`p-1 sm:p-2 rounded-lg text-xs border cursor-pointer hover:scale-105 transition-all duration-200 group ${
              getTypeColor(item.type)
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (onContentEdit) onContentEdit(item.id);
            }}
          >
            <div className="font-medium truncate">{item.title}</div>
            <div className="text-xs opacity-70 hidden sm:block">
              {item.scheduledTime && format(new Date(`2000-01-01T${item.scheduledTime}`), 'h:mm a')}
            </div>
            <div className="flex items-center justify-between mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs opacity-60">{item.type}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onContentDelete) onContentDelete(item.id);
                }}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
